import api from './api';

const urlBase64ToUint8Array = (base64String) => {
  if (!base64String) {
    throw new Error('VAPID public key is empty');
  }
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

let isSubscribing = false;

export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported');
    return false;
  }

  if (isSubscribing) {
    console.log('Subscription already in progress...');
    return false;
  }

  isSubscribing = true;

  try {
    // 1. Get ready SW registration
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('User is already subscribed to push notifications');
      // Optionally update the server with the existing subscription to be sure
      await api.post('/notifications/subscribe', existingSubscription);
      isSubscribing = false;
      return true;
    }

    // 2. Get VAPID Public Key
    let publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    let source = 'environment variable';

    if (!publicKey) {
      console.log('VITE_VAPID_PUBLIC_KEY not found in env, fetching from server...');
      const { data } = await api.get('/notifications/vapid-key');
      publicKey = data?.publicKey;
      source = 'server API';
    }

    console.log(`Using VAPID Public Key from ${source}:`, publicKey);

    if (!publicKey) {
      console.error('No VAPID public key available (env or server)');
      isSubscribing = false;
      return false;
    }

    if (publicKey.includes('Run \'npx web-push')) {
      console.error('Placeholder VAPID key detected. Backend configuration required.');
      isSubscribing = false;
      return false;
    }

    console.log('Converting VAPID key...');
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // 3. Subscribe
    console.log('Requesting push subscription...');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // 4. Send subscription to server
    await api.post('/notifications/subscribe', subscription);
    console.log('Push Notification Subscribed!');

    isSubscribing = false;
    return true;
  } catch (error) {
    isSubscribing = false;
    if (error.name === 'AbortError') {
      console.error('Push subscription aborted. This often happens due to network issues or invalid VAPID keys.', error);
    } else if (error.name === 'NotAllowedError') {
      console.warn('User denied notification permission.');
    } else {
      console.error('Failed to subscribe to push notifications:', error);
    }
    return false;
  }
};

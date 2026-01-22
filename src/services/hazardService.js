import api from './api';

export const reportHazard = async (formData) => {
  // formData should be a FormData object if sending files
  const response = await api.post('/hazards/report', formData);
  return response.data;
};

export const getNearbyHazards = async (lat, lng, radiusKm = 5) => {
  const response = await api.get('/hazards/nearby', {
    params: { lat, lng, radius: radiusKm },
  });
  return response.data;
};

export const validateHazard = async (id, action, location = null) => {
  const payload = { action };
  if (location) {
      payload.location = { lat: location.lat, lng: location.lng };
  }
  
  const response = await api.post(`/hazards/${id}/validate`, payload);
  return response.data;
};

export const getHazardDetails = async (id) => {
    const response = await api.get(`/hazards/${id}`);
    return response.data;
};

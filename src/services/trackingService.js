import api from './api';

export const updateTracking = async (trackingData) => {
  // trackingData: { location, speed, heading, isMoving, routePolyline }
  const response = await api.post('/tracking/update', trackingData);
  return response.data;
};

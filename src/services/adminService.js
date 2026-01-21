import api from './api';

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getHeatmapData = async () => {
    const response = await api.get('/admin/heatmap');
    return response.data;
};

export const getTrends = async (period = 'month') => {
    const response = await api.get('/admin/trends', { params: { period } });
    return response.data;
};

export const getPendingHazards = async () => {
    const response = await api.get('/admin/pending-hazards');
    return response.data;
};

export const updateHazardStatus = async (id, status) => {
    const response = await api.put(`/admin/hazards/${id}/status`, { status });
    return response.data;
};

export const deleteHazard = async (id) => {
    const response = await api.delete(`/admin/hazards/${id}`);
    return response.data;
};

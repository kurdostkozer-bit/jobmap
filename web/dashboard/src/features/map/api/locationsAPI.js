import apiClient from '../../../core/api/apiClient';

export const locationsAPI = {
  getAllGovernorates: () => apiClient.get('/map/governorates'),

  getGovernorate: (id) => apiClient.get(`/map/governorates/${id}`),

  getDistrictsByGovernorate: (governorateId) =>
    apiClient.get(`/map/governorates/${governorateId}/districts`),

  getNeighborhoodsByDistrict: (districtId) =>
    apiClient.get(`/map/districts/${districtId}/neighborhoods`),

  getLocationDrillDown: (governorateId) =>
    apiClient.get(`/map/governorates/${governorateId}/drill-down`),
};

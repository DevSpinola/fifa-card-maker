import api from './api';

export const getSports = async () => {
  try {
    const response = await api.get('/sport');
    return response.data;
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw error;
  }
};

export const getSportById = async (id) => {
  try {
    const response = await api.get(`/sport/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sport ${id}:`, error);
    throw error;
  }
};

export const createSport = async (sportData) => {
  try {
    const response = await api.post('/sport', sportData);
    return response.data;
  } catch (error) {
    console.error('Error creating sport:', error);
    throw error;
  }
};

export const updateSport = async (id, sportData) => {
  try {
    const response = await api.put(`/sport/${id}`, sportData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sport ${id}:`, error);
    throw error;
  }
};

export const deleteSport = async (id) => {
  try {
    const response = await api.delete(`/sport/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sport ${id}:`, error);
    throw error;
  }
};


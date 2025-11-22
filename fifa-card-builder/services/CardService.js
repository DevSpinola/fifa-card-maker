import api from './api';

export const getCards = async () => {
  try {
    const response = await api.get('/card');
    return response.data;
  } catch (error) {
    console.error('Error fetching cards:', error);
    throw error;
  }
};

export const createCard = async (cardData) => {
  try {
    const response = await api.post('/card', cardData);
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

export const getCardById = async (id) => {
  try {
    const response = await api.get(`/card/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching card ${id}:`, error);
    throw error;
  }
};

export const updateCard = async (id, cardData) => {
  try {
    const response = await api.put(`/card/${id}`, cardData);
    return response.data;
  } catch (error) {
    console.error(`Error updating card ${id}:`, error);
    throw error;
  }
};

export const deleteCard = async (id) => {
  try {
    const response = await api.delete(`/card/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting card ${id}:`, error);
    throw error;
  }
};


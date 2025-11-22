import api from './api';

export const getPlayers = async () => {
  try {
    const response = await api.get('/player');
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const getPlayerById = async (id) => {
  try {
    const response = await api.get(`/player/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player ${id}:`, error);
    throw error;
  }
};

export const createPlayer = async (playerData) => {
  try {
    const response = await api.post('/player', playerData);
    return response.data;
  } catch (error) {
    console.error('Error creating player:', error);
    throw error;
  }
};

export const updatePlayer = async (id, playerData) => {
  try {
    const response = await api.put(`/player/${id}`, playerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating player ${id}:`, error);
    throw error;
  }
};

export const deletePlayer = async (id) => {
  try {
    const response = await api.delete(`/player/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting player ${id}:`, error);
    throw error;
  }
};


import axios from './axios';

export const createPreference = async (payload) => {
  const res = await axios.post('/api/mercadopago/create_preference', payload);
  return res.data;
};

export default { createPreference };
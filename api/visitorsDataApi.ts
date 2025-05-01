import axios from 'axios';

// const BASE_URL = 'http://localhost:8000/api'; // URL de base
const BASE_URL = 'http://192.168.137.1:8000/api';

export const fetchVisitorsData = async (limit: number, offset: number) => {
  const res = await axios.get(`${BASE_URL}/visitors-infos/?limit=${limit}&offset=${offset}`);
  return res.data;
}
import axios from 'axios';

export function createApiInstance() {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
}

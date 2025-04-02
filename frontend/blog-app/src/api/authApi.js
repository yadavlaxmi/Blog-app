

import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

export const loginUser = (credentials) => axios.post(`${API}/login`, credentials);
export const registerUser = (credentials) => axios.post(`${API}/register`, credentials);
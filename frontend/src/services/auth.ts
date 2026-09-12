import axios from 'axios';

const BASE = 'http://localhost:8000/api/v1';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await axios.post<TokenResponse>(`${BASE}/auth/login`, { email, password });
  return data;
}

export async function register(email: string, password: string): Promise<TokenResponse> {
  const { data } = await axios.post<TokenResponse>(`${BASE}/auth/register`, { email, password });
  return data;
}

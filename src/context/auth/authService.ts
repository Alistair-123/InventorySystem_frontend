import axiosInstance from '../../utils/axiosInstance';
import type { AuthResponse, LoginPayload } from './authTypes';

export const authService = {
  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      data,
      { withCredentials: true }
    );
    return res.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  },

  async refresh(): Promise<{ accessToken: string }> {
    const res = await axiosInstance.post(
      '/auth/refresh',
      {},
      { withCredentials: true }
    );
    return res.data;
  },
};
export default authService;
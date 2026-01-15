import axiosInstance from '../../utils/axiosInstance';
import type { AuthResponse, LoginPayload, Personnel } from './authTypes';

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
    await axiosInstance.post(
      '/auth/logout',
      {},
      { withCredentials: true }
    );
  },

  async refresh(): Promise<{ accessToken: string }> {
    const res = await axiosInstance.post<{ accessToken: string }>(
      '/auth/refresh-tokens',
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  async authCheck(): Promise<Personnel> {
    const res = await axiosInstance.get<{ personnel: Personnel }>(
      '/auth/auth-check',
      { withCredentials: true }
    );

    return res.data.personnel;
  },
};

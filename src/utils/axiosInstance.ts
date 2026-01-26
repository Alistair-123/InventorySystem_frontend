  import axios from "axios";
  import type { AxiosInstance } from "axios";
  // Base URL is read from Vite env variable VITE_API_URL, fallback to localhost
  const baseURL = 'http://localhost:5000/api';

  export const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
    headers: {
      Accept: 'application/json',
    },
  });

  // NOTE: Authentication is handled with cookies set by the backend (HttpOnly).
  // Do NOT attempt to read or write the token in JavaScript (HttpOnly cookies aren't accessible).
  // Instead ensure your backend sets the cookie with appropriate SameSite/CORS flags and that
  // `withCredentials: true` is enabled (done above) so cookies are sent automatically.

  // Basic response interceptor for centralised error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Example: handle 401 globally (optional):
      // if (error.response && error.response.status === 401) {
      //   // redirect to login or dispatch a logout flow
      // }
      return Promise.reject(error);
    }
  );

  // Helper: call backend logout endpoint to clear the cookie (can't clear HttpOnly cookie from JS)
  // export async function logout() {
  //   // Adjust the path if your backend uses a different endpoint
  //   return axiosInstance.post('/auth/logout');
  // }

  // also export default for compatibility
  export default axiosInstance;
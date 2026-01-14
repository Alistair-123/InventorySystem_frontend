export type Role = 'admin' | 'user';

export type Personnel = {
  id: string;
  personnelId: string;
  firstName: string;
  lastName: string;
  designationName: string;
  role: Role;
};

export type AuthResponse = {
  accessToken: string;
  personnel: Personnel;
};

export type LoginPayload = {
  personnelId: string;
  password: string;
};

export type AuthContextType = {
  user: Personnel | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

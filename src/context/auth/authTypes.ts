export type Role = 'admin' | 'user';

export type Personnel = {
  image?: string | null;
  id: string;
  personnelId: string;
  firstName: string;
  lastName: string;
  designationName: string;
  role: Role;
};

export type LoginPayload = {
  personnelId: string;
  password: string;
};

export type AuthContextType = {
  user: Personnel | null;
  loading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
};

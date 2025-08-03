//user type
export type User = {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  phone: number;
  mfaEnabled?: boolean
  mfaSecret?: string
}

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
};
export type UserRole =
  | "CUSTOMER"
  | "ADMIN"
  | "RESTAURANT_OWNER"
  | "COURIER";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  phone?: string;
};

export type UpdateProfileInput = {
  name?: string;
  phone?: string | null;
};

export type AuthApiErrorPayload = {
  code?: string;
  error?: string;
  fields?: Record<string, string[]>;
};

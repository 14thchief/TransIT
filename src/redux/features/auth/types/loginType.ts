import { Role } from "../../admin/types/roleManagementType";

export type SigninPayload = {
  username: string;
  password: string;
};

export type SigninResponse = {
  status: boolean;
  message: string;
  data: SignedUser;
};

export type SignedUser = {
  accessToken: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};

export type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
  token: string;
};

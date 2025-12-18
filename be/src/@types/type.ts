export type ArrangeType = "desc" | "asc";
export interface UserLogin {
  email: string;
  password: string;
}
export interface UserRegister extends UserLogin {
  confirmPassword: string;
  fullName: string;
}

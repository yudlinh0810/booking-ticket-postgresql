export interface UserInfo {
  id?: number;
}
export interface User extends UserInfo {
  email: string;
  fullName: string;
  dateBirth?: string | Date;
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: "google" | "facebook" | "local";
  sex?: "male" | "female" | "other";
}

export interface UserData extends UserInfo {
  email: string;
  fullName: string;
  dateBirth?: string;
  urlImg?: string;
  urlPublicImg?: string;
  phone?: string;
  address?: string;
  provider?: "google" | "facebook" | "local";
  sex?: "male" | "female" | "other";
}

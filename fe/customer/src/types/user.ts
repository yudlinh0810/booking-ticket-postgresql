export interface UserInfo {
  id: number;
}
export interface User extends UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  date_birth?: string | Date;
  avatar?: string;
  phone?: string;
  address?: string;
  provider?: "google" | "facebook" | "local";
  sex?: "male" | "female" | "other";
}

export interface UserData extends UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  date_birth?: string;
  url_img?: string;
  phone?: string;
  address?: string;
  provider?: "google" | "facebook" | "local";
  sex?: "male" | "female" | "other";
}

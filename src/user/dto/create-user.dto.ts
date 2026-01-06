export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

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
  SALES_MAN = 'sales_man',
  STORE_MANAGER = 'store_manager',
  SUPER_ADMIN = 'super_admin',
}

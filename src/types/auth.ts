export interface JwtPayload {
  sub: string;
  role: string;
  jti: string;
  iat: number;
  exp: number;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TL = 'TL',
  EMPLOYEE = 'EMPLOYEE',
}

export const RoleHierarchy: Record<Role, number> = {
  ADMIN: 4,
  MANAGER: 3,
  TL: 2,
  EMPLOYEE: 1,
};

export interface UserPayload {
  id: string;
  email: string;
  role: Role;
}

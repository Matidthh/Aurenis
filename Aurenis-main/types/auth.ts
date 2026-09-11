export interface UserSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isSystemAdmin: boolean;
  activeSchoolId?: string;
  activeSchoolSlug?: string;
  activeMembershipId?: string;
  roleName?: string;
  permissions: string[];
}

export interface AuthCookiePayload {
  sub: string; // userId
  email: string;
  firstName: string;
  lastName: string;
  isSystemAdmin: boolean;
  schoolId?: string;
  schoolSlug?: string;
  membershipId?: string;
  roleName?: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

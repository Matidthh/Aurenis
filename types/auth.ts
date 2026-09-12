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
  tokenId?: string; // Identificador único jti
  familyId?: string; // Token Family ID para rotación
  tokenType?: "access" | "refresh";
  tokenVersion?: number;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // en segundos
  refreshExpiresIn: number; // en segundos
  tokenType: "Bearer";
}

export interface RefreshTokenRecord {
  tokenId: string;
  familyId: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  isUsed: boolean;
  isRevoked: boolean;
  replacedByTokenId?: string;
}

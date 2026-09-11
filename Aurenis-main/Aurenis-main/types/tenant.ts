export interface TenantContext {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
  userId: string;
  membershipId: string;
  roleName: string;
  permissions: string[];
  timezone: string;
}

export interface SchoolSummary {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string | null;
  roleName: string;
  roleDisplayName: string;
}

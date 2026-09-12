export type SubscriptionStatus = "ACTIVE" | "TRIAL" | "SUSPENDED_PAYMENT" | "EXPIRED" | "CANCELLED";
export type SubscriptionPlan = "BASIC" | "PRO" | "ENTERPRISE";

export interface SchoolSubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxStudents: number;
  currentStudents: number;
  monthlyFeeClp: number;
  billingCycle: "MONTHLY" | "ANNUAL";
  renewalDate: string;
  isPaymentUpToDate: boolean;
}

export interface TenantContext {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
  subdomain: string;
  customDomain?: string | null;
  userId: string;
  membershipId: string;
  roleName: string;
  permissions: string[];
  timezone: string;
  isSuspended: boolean;
  suspensionReason?: string | null;
  subscription: SchoolSubscriptionInfo;
}

export interface SchoolSummary {
  id: string;
  slug: string;
  name: string;
  subdomain?: string;
  logoUrl?: string | null;
  roleName: string;
  roleDisplayName: string;
  status: string;
  subscription?: SchoolSubscriptionInfo;
}


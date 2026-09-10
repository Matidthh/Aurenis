import React from "react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "brand" | "success" | "warning" | "neutral";
  section?: string;
}

export interface UserSessionInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  isSystemAdmin: boolean;
}

export interface SchoolContextInfo {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
  roleName: string;
}

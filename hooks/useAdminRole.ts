"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface AdminRoleResult {
  isOracle: boolean;
  isBank: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
}

export function useAdminRole(): AdminRoleResult {
  const { user, isLoaded } = useUser();
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    fetch("/api/user/roles")
      .then((r) => r.json())
      .then((data) => {
        setRoles(data.roles ?? []);
      })
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, [user, isLoaded]);

  return {
    isOracle: roles.includes("ORACLE"),
    isBank: roles.includes("BANK"),
    isSuperAdmin: roles.includes("SUPER_ADMIN"),
    isLoading: loading,
  };
}

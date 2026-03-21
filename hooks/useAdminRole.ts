"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";

interface AdminRoleResult {
  isOracle:     boolean;
  isBank:       boolean;
  isSuperAdmin: boolean;
  isLoading:    boolean;
}

// Module-level cache - persists across re-renders
// Keyed by clerkId so different users get their own cache
const roleCache = new Map<string, {
  roles:     string[];
  fetchedAt: number;
}>();

const CACHE_TTL = 60_000; // 1 minute

export function clearRoleCache(clerkId?: string) {
  if (clerkId) {
    roleCache.delete(clerkId);
  } else {
    roleCache.clear();
  }
}

export function useAdminRole(): AdminRoleResult {
  const { user, isLoaded } = useUser();
  const [roles, setRoles]     = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // No user - not loading, no roles
    if (!user) {
      setLoading(false);
      setRoles([]);
      return;
    }

    const clerkId = user.id;

    // Check cache first
    const cached = roleCache.get(clerkId);
    if (
      cached &&
      Date.now() - cached.fetchedAt < CACHE_TTL
    ) {
      setRoles(cached.roles);
      setLoading(false);
      return;
    }

    // Prevent duplicate in-flight requests
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    fetch("/api/user/roles")
      .then((r) => r.json())
      .then((data) => {
        const userRoles = data.roles ?? [];
        // Store in cache
        roleCache.set(clerkId, {
          roles:     userRoles,
          fetchedAt: Date.now(),
        });
        setRoles(userRoles);
      })
      .catch(() => setRoles([]))
      .finally(() => {
        setLoading(false);
        fetchingRef.current = false;
      });

  // CRITICAL: only re-run when user.id or isLoaded changes
  // NOT on every render
  }, [user?.id, isLoaded]);

  return {
    isOracle:     roles.includes("ORACLE"),
    isBank:       roles.includes("BANK"),
    isSuperAdmin: roles.includes("SUPER_ADMIN"),
    isLoading:    loading,
  };
}

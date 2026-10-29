"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  X,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TableFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [role, setRole] = useState(searchParams.get("role") || "ALL");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [gender, setGender] = useState(searchParams.get("gender") || "ALL");
  const [isEmailVerified, setIsEmailVerified] = useState(
    searchParams.get("isEmailVerified") || "ALL"
  );

  // Synchronize state if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("searchTerm") || "");
    setRole(searchParams.get("role") || "ALL");
    setStatus(searchParams.get("status") || "ALL");
    setGender(searchParams.get("gender") || "ALL");
    setIsEmailVerified(searchParams.get("isEmailVerified") || "ALL");
  }, [searchParams]);

  // Debounced search term update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentInUrl = searchParams.get("searchTerm") || "";
      if (searchTerm.trim() !== currentInUrl) {
        applyFilters({ searchTerm: searchTerm.trim() });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 on filter/search change
    params.set("page", "1");

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setRole("ALL");
    setStatus("ALL");
    setGender("ALL");
    setIsEmailVerified("ALL");

    startTransition(() => {
      router.push(pathname);
    });
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    role !== "ALL" ? 1 : 0,
    status !== "ALL" ? 1 : 0,
    gender !== "ALL" ? 1 : 0,
    isEmailVerified !== "ALL" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-3.5 pb-1">
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input with Icon */}
        <div className="relative flex-1 min-w-[240px] max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by full name or email..."
            className="pl-9.5 pr-8 h-10 text-sm rounded-lg bg-background border-border/80 focus-visible:ring-primary/20"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                applyFilters({ searchTerm: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <Select
            value={role}
            onValueChange={(val) => {
              setRole(val);
              applyFilters({ role: val });
            }}
          >
            <SelectTrigger className="h-10 w-[130px] text-xs font-medium rounded-lg">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              applyFilters({ status: val });
            }}
          >
            <SelectTrigger className="h-10 w-[130px] text-xs font-medium rounded-lg">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="DELETED">Deleted</SelectItem>
            </SelectContent>
          </Select>

          {/* Gender Filter */}
          <Select
            value={gender}
            onValueChange={(val) => {
              setGender(val);
              applyFilters({ gender: val });
            }}
          >
            <SelectTrigger className="h-10 w-[130px] text-xs font-medium rounded-lg">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHERS">Others</SelectItem>
            </SelectContent>
          </Select>

          {/* Verification Status Filter */}
          <Select
            value={isEmailVerified}
            onValueChange={(val) => {
              setIsEmailVerified(val);
              applyFilters({ isEmailVerified: val });
            }}
          >
            <SelectTrigger className="h-10 w-[140px] text-xs font-medium rounded-lg">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Verification</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAll}
              className="h-10 text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer rounded-lg border-dashed"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" />
            Active filters:
          </span>

          {searchTerm && (
            <Badge variant="secondary" className="gap-1 py-1 px-2 font-normal text-xs">
              Search: <span className="font-semibold">{searchTerm}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setSearchTerm("");
                  applyFilters({ searchTerm: "" });
                }}
              />
            </Badge>
          )}

          {role !== "ALL" && (
            <Badge variant="secondary" className="gap-1 py-1 px-2 font-normal text-xs">
              Role: <span className="font-semibold">{role}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setRole("ALL");
                  applyFilters({ role: "ALL" });
                }}
              />
            </Badge>
          )}

          {status !== "ALL" && (
            <Badge variant="secondary" className="gap-1 py-1 px-2 font-normal text-xs">
              Status: <span className="font-semibold">{status}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setStatus("ALL");
                  applyFilters({ status: "ALL" });
                }}
              />
            </Badge>
          )}

          {gender !== "ALL" && (
            <Badge variant="secondary" className="gap-1 py-1 px-2 font-normal text-xs">
              Gender: <span className="font-semibold">{gender}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setGender("ALL");
                  applyFilters({ gender: "ALL" });
                }}
              />
            </Badge>
          )}

          {isEmailVerified !== "ALL" && (
            <Badge variant="secondary" className="gap-1 py-1 px-2 font-normal text-xs">
              Verified: <span className="font-semibold">{isEmailVerified === "true" ? "Yes" : "No"}</span>
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => {
                  setIsEmailVerified("ALL");
                  applyFilters({ isEmailVerified: "ALL" });
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export default TableFilterBar;

"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Shield,
  Activity,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  sortKey?: string;
}

export interface ManagementTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  isRefreshing?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onUpdateStatus?: (row: T) => void;
  onUpdateRole?: (row: T) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  customActions?: (row: T) => React.ReactNode;
}

export function ManagementTable<T>({
  data = [],
  columns = [],
  getRowKey,
  isLoading = false,
  isRefreshing = false,
  emptyMessage = "No records found",
  emptySubtitle = "Try adjusting your search or filters to find what you're looking for.",
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  onUpdateRole,
  sortBy,
  sortOrder,
  onSort,
  customActions,
}: ManagementTableProps<T>) {
  const hasActions =
    onView || onEdit || onDelete || onUpdateStatus || onUpdateRole || customActions;

  return (
    <div className="relative w-full rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden">
      {/* Refreshing backdrop spinner */}
      {isRefreshing && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px] transition-all">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs font-medium text-foreground">Updating data...</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/70">
              {columns.map((column, index) => {
                const isSortable = !!column.sortKey && !!onSort;
                const isCurrentSort = sortBy === column.sortKey;

                return (
                  <TableHead
                    key={index}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5 px-4",
                      column.headerClassName || column.className
                    )}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => column.sortKey && onSort(column.sortKey)}
                        className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors group cursor-pointer focus-visible:outline-none"
                      >
                        <span>{column.header}</span>
                        {isCurrentSort ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        )}
                      </button>
                    ) : (
                      <span>{column.header}</span>
                    )}
                  </TableHead>
                );
              })}

              {hasActions && (
                <TableHead className="w-[80px] text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3.5 px-4">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <TableRow key={rIdx} className="border-border/40">
                  {columns.map((_, cIdx) => (
                    <TableCell key={cIdx} className="py-4 px-4">
                      <Skeleton className="h-4 w-full max-w-[120px]" />
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell className="py-4 px-4 text-right">
                      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-foreground">{emptyMessage}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {emptySubtitle}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Table Rows
              data.map((row) => {
                const key = getRowKey(row);
                return (
                  <TableRow
                    key={key}
                    className="group border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <TableCell
                        key={colIdx}
                        className={cn("py-3.5 px-4 text-sm text-foreground", col.className)}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(row)
                          : String(row[col.accessor] ?? "-")}
                      </TableCell>
                    ))}

                    {hasActions && (
                      <TableCell className="py-3.5 px-4 text-right">
                        {customActions ? (
                          customActions(row)
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-lg">
                              <DropdownMenuLabel className="text-[11px] font-medium text-muted-foreground px-2 py-1">
                                User Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />

                              {onView && (
                                <DropdownMenuItem
                                  onClick={() => onView(row)}
                                  className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                                >
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                              )}

                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(row)}
                                  className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                                >
                                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>Edit Profile</span>
                                </DropdownMenuItem>
                              )}

                              {onUpdateStatus && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateStatus(row)}
                                  className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                                >
                                  <Activity className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Change Status</span>
                                </DropdownMenuItem>
                              )}

                              {onUpdateRole && (
                                <DropdownMenuItem
                                  onClick={() => onUpdateRole(row)}
                                  className="cursor-pointer gap-2 py-1.5 text-xs font-medium"
                                >
                                  <Shield className="h-3.5 w-3.5 text-purple-500" />
                                  <span>Change Role</span>
                                </DropdownMenuItem>
                              )}

                              {onDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => onDelete(row)}
                                    className="cursor-pointer gap-2 py-1.5 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Soft Delete</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ManagementTable;
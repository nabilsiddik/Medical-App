"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { IMeta } from "@/types/user.interface";

interface TablePaginationProps {
  meta?: IMeta;
  itemName?: string;
  isPending?: boolean;
}

export function TablePagination({
  meta = { page: 1, limit: 10, total: 0, totalPage: 1 },
  itemName = "items",
  isPending = false,
}: TablePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page = 1, limit = 10, total = 0, totalPage = 1 } = meta;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage || newPage === page) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", newLimit);
    params.set("page", "1"); // Reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPage);
      } else if (page >= totalPage - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPage - 3; i <= totalPage; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPage);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1">
      {/* Left side: Results Count & Limit Selector */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground w-full sm:w-auto justify-between sm:justify-start">
        <p>
          Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> {itemName}
        </p>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-sm">Rows per page:</span>
          <Select
            value={limit.toString()}
            onValueChange={handleLimitChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-9 w-[76px] text-sm font-medium">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right side: Page Navigation Buttons */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        {/* First Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex cursor-pointer disabled:opacity-40"
          onClick={() => handlePageChange(1)}
          disabled={page <= 1 || isPending}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>

        {/* Previous Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer disabled:opacity-40"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1 || isPending}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-sm text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = p === page;
            return (
              <Button
                key={`page-${p}`}
                variant={isCurrent ? "default" : "outline"}
                size="icon"
                className={`h-9 w-9 text-sm font-medium cursor-pointer ${
                  isCurrent ? "shadow-xs font-bold" : ""
                }`}
                onClick={() => handlePageChange(Number(p))}
                disabled={isPending}
              >
                {p}
              </Button>
            );
          })}
        </div>

        {/* Next Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 cursor-pointer disabled:opacity-40"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPage || isPending}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>

        {/* Last Page */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 hidden sm:flex cursor-pointer disabled:opacity-40"
          onClick={() => handlePageChange(totalPage)}
          disabled={page >= totalPage || isPending}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;

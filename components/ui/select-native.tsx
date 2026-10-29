import { ChevronDownIcon } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

const SelectNative = ({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) => {
  return (
    <div className="relative flex">
      <select
        className={cn(
          "peer inline-flex w-full cursor-pointer appearance-none items-center rounded-[4px] border border-slate-200/50 bg-[#e6eaee] dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 text-sm shadow-none outline-none transition-all duration-200 focus-visible:border-primary/50 focus-visible:bg-white dark:focus-visible:bg-slate-900 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          props.multiple
            ? "py-1 *:px-3 *:py-1 [&_option:checked]:bg-accent"
            : "h-11 ps-4 pe-8",
          className,
        )}
        data-slot="select-native"
        {...props}
      >
        {children}
      </select>
      {!props.multiple && (
        <span className="pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50 peer-aria-invalid:text-destructive/80">
          <ChevronDownIcon aria-hidden="true" size={16} />
        </span>
      )}
    </div>
  );
};

export { SelectNative };

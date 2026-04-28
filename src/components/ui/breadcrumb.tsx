import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "./button";

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={cn(className)}
      {...props}
    />
  );
}

function BreadcrumbList({
  className,
  style,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center text-sm wrap-break-word text-muted-foreground min-w-[100px]",
        className,
      )}
      style={{ gap: 1, ...style }}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "hover:bg-gray-300/40 inline-flex items-center gap-1.5 bg-gray-600/40 border-1 h-[36px] p-2",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors hover:text-foreground truncate max-w-[10ch]",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-normal text-foreground truncate max-w-[10ch]",
        className,
      )}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <div className="w-0.5 h-full bg-gray-200/20" />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  );
}

type ButtonProps = React.PropsWithChildren & React.ComponentProps<"button">;

function BreadCrumbButton({ children, className, disabled }: ButtonProps) {
  return (
    <Button
      disabled={Boolean(disabled)}
      className={cn(
        className ? className : "",
        "border-gray-200/20 bg-gray-600/20 hover:text-black text-white rounded-xs truncate max-w-[10ch]",
      )}
    >
      {children}
    </Button>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadCrumbButton,
};

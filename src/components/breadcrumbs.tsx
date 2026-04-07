import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "@tanstack/react-router";
import React from "react";

export function Breadcrumbs({ path }: { path: string }) {
  const paths = path.split(",");
  const location = useLocation();

  const isCurrentPage = location.pathname === path;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, i) => (
          <React.Fragment key={path + i + "item"}>
            <BreadcrumbItem>
              {isCurrentPage ? (
                <BreadcrumbPage>{path}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={path}>{path}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i !== paths.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

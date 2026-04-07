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

export function Breadcrumbs({ currentPath }: { currentPath: string }) {
  const location = useLocation();
  const paths = currentPath.split("/");

  const isCurrentPage = location.pathname === currentPath;

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
                  <Link to="/" search={{ path: getURLSegment(paths, i) }}>
                    {path}
                  </Link>
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

const getURLSegment = (url: string[], endIndex: number) => {
  const newURL = url.slice(0, endIndex + 1).join("/");
  return encodeURIComponent(newURL);
};

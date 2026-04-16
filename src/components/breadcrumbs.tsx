import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@tanstack/react-router";
import React from "react";

export function Breadcrumbs({ currentPath }: { currentPath: string }) {
  const paths = currentPath.split("/").filter((path) => path !== "");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, i) => (
          <React.Fragment key={path + i + "item"}>
            <BreadcrumbItem>
              {i == 0 || i == paths.length - 1 ? (
                <BreadcrumbPage className="truncate max-w-[10ch]">
                  {path}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to="/"
                    search={{ path: getURLSegment(paths, i) }}
                    className="truncate max-w-[10ch]"
                  >
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
  return "/" + encodeURIComponent(newURL);
};

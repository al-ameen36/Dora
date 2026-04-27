import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { currentPathAtom } from "@/state/files";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import React from "react";

export function Breadcrumbs() {
  const currentPath = useAtomValue(currentPathAtom);
  let allParts = decodeURIComponent(currentPath)
    .split("/")
    .filter((path) => path !== "");
  let pathsToDisplay: string[] = [...allParts];

  if (allParts.length > 4)
    pathsToDisplay = [
      allParts[0],
      allParts[1],
      "...",
      allParts[allParts.length - 2],
      allParts[allParts.length - 1],
    ];

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-gray-900/70 p-2 rounded-sm">
        {pathsToDisplay.map((path, i) => (
          <React.Fragment key={path + i + "item"}>
            <BreadcrumbItem>
              {i == 0 || i == allParts.length - 1 || path === "..." ? (
                <BreadcrumbPage className="truncate max-w-[10ch]">
                  {path}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to="/"
                    search={{ path: getURLSegment(allParts, i) }}
                    className="truncate max-w-[10ch]"
                  >
                    {path}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {i !== pathsToDisplay.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const getURLSegment = (URLParts: string[], endIndex: number) => {
  const newURL = URLParts.slice(0, endIndex + 1)
    .join("/")
    .replace("/...", "");

  return "/" + newURL;
};

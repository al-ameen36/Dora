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
  let allPaths = currentPath.split("/").filter((path) => path !== "");
  let pathsToDisplay: string[] = [...allPaths];

  if (allPaths.length > 4)
    pathsToDisplay = [
      allPaths[0],
      allPaths[1],
      "...",
      allPaths[allPaths.length - 2],
      allPaths[allPaths.length - 1],
    ];

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-gray-900/70 p-2 rounded-sm">
        {pathsToDisplay.map((path, i) => (
          <React.Fragment key={path + i + "item"}>
            <BreadcrumbItem>
              {i == 0 || i == allPaths.length - 1 || path === "..." ? (
                <BreadcrumbPage className="truncate max-w-[10ch]">
                  {path}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to="/"
                    search={{ path: getURLSegment(allPaths, i) }}
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

const getURLSegment = (url: string[], endIndex: number) => {
  const newURL = url
    .slice(0, endIndex + 1)
    .join("/")
    .replace("/...", "");
  console.log(newURL);

  return "/" + encodeURIComponent(newURL);
};

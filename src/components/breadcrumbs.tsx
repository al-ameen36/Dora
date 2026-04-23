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
  let paths = currentPath.split("/").filter((path) => path !== "");

  if (paths.length > 4)
    paths = [
      paths[0],
      paths[1],
      paths[paths.length - 2],
      paths[paths.length - 1],
    ];

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-gray-900/70 p-2">
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
            {i === 1 && (
              <>
                ...
                <BreadcrumbSeparator />
              </>
            )}
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

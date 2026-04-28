import { createFileRoute } from "@tanstack/react-router";
import { GridItem } from "@/components/file";
import z from "zod";
import { EmptyState } from "@/components/empty-state";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getFiles } from "@/functions/file-ops";
import SkeletonFiles from "@/components/skeleton-files";
import { useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { currentPathAtom } from "@/state/files";
import { fileSizeAtom } from "@/state/app";

const searchSchema = z.object({
  path: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: searchSchema,
  loaderDeps: ({ search: { path } }) => ({ path }),
  loader: async ({ deps: { path } }) => getFiles({ data: { path } }),
});

function App() {
  const { path } = Route.useSearch();
  const httpSafePath = encodeURIComponent(path || "/");
  const setCurrentPath = useSetAtom(currentPathAtom);
  const fileSize = useAtomValue(fileSizeAtom);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ls", httpSafePath],
    queryFn: () => getFiles({ data: { path: httpSafePath } }),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const totalCount = data?.files?.length || 0;
  const columnsCount = Math.max(
    1,
    Math.floor((containerWidth || 800) / fileSize.width),
  ); // dynamically get the number of columns the container can acommodate
  const rowCount = Math.ceil(totalCount / columnsCount);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => fileSize.height,
    gap: 16,
    overscan: columnsCount * 3,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    setCurrentPath(httpSafePath);
  }, [path]);

  useEffect(() => {
    if (parentRef.current) {
      setContainerWidth(parentRef.current.clientWidth);
    }

    const callback = () => {
      if (parentRef.current) {
        setContainerWidth(parentRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }, [totalCount]);

  return (
    <main className="page-wrap px-4 pt-14 text-sm">
      <Header />

      {isError && <p>Error</p>}
      {totalCount === 0 && !isLoading && <EmptyState />}
      {isLoading && <SkeletonFiles />}

      {totalCount > 0 && (
        <section
          // fit element on screen and allow vertical scrolling
          // element height = 100vh - mt-10 - (<main>) pt-14  - <header> (height + block padding)
          className="mt-10 h-[calc(100vh-40px-56px-156px)] overflow-auto max-w-full"
          ref={parentRef}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {data &&
              virtualItems.map((virtualRow) => {
                const startIndex = virtualRow.index * columnsCount;

                return (
                  <div
                    key={virtualRow.index + "-row"}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${fileSize.height}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      display: "flex",
                      gap: "1rem", // 1rem corresponds to gap-4
                    }}
                  >
                    {Array.from({ length: columnsCount }).map((_, colIndex) => {
                      const fileIndex = startIndex + colIndex;
                      if (fileIndex >= totalCount) return null;

                      const file = data.files[fileIndex];
                      return (
                        <GridItem
                          file={file}
                          key={file.name + fileIndex + "-folder"}
                          style={{
                            width: `${fileSize.width}px`,
                            height: `${fileSize.height}px`,
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </section>
      )}
    </main>
  );
}

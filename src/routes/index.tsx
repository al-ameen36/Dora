import { createFileRoute } from "@tanstack/react-router";
import { GridItem } from "@/components/file";
import z from "zod";
import { EmptyState } from "@/components/empty-state";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { getFiles } from "@/functions/file-ops";
import SkeletonFiles from "@/components/skeleton-files";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { currentPathAtom } from "@/store/atoms/files";

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
  const setCurrentPath = useSetAtom(currentPathAtom);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ls", path],
    queryFn: () => getFiles({ data: { path } }),
  });
  const totalCount = data?.files.length || 0;

  useEffect(() => {
    setCurrentPath(decodeURIComponent(path || ""));
  }, [path]);

  return (
    <main className="page-wrap px-4 pb-8 pt-14 text-sm">
      <Header />

      {isError && <p>Error</p>}
      {totalCount === 0 && !isLoading && <EmptyState />}
      {isLoading && <SkeletonFiles />}

      {totalCount > 0 && (
        <section className="mt-10">
          <div className="mt-10 flex flex-wrap gap-4">
            {data &&
              data.files.map((file, i) => (
                <GridItem file={file} key={file.name + i + "-folder"} />
              ))}
          </div>
        </section>
      )}
    </main>
  );
}

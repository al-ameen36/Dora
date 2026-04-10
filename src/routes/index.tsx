import { FileGridItem } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderGridItem } from "@/components/folder";
import type { FileSection } from "@/types";
import z from "zod";
import { EmptyState } from "@/components/empty-state";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getFiles } from "@/functions/file-ops";

const productSearchSchema = z.object({
  path: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: productSearchSchema,
  loaderDeps: ({ search: { path } }) => ({ path }),
  loader: async ({ deps: { path } }) => getFiles({ data: { path } }),
});

function App() {
  const { path } = Route.useSearch();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["files", path],
    queryFn: () => getFiles({ data: { path } }),
  });

  const allFileAndFolders = data?.files || [];
  const folders = data?.files.filter((file) => file.isDirectory) || [];
  const files = data?.files.filter((file) => !file.isDirectory) || [];
  const currentPath = data?.currentPath || "";

  const [selected, setSelected] = useState<FileSection>({
    folders: [],
    files: [],
  });

  const totalSelected = selected.folders.length + selected.files.length;

  const handleSelect = (name: string, isFolder: boolean) => {
    setSelected((prev) => {
      const next = {
        folders: [...prev.folders],
        files: [...prev.files],
      };

      if (isFolder) {
        if (next.folders.includes(name))
          next.folders = next.folders.filter((f) => f !== name);
        else next.folders.push(name);
      } else {
        if (next.files.includes(name))
          next.files = next.files.filter((f) => f !== name);
        else next.files.push(name);
      }

      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (totalSelected == data?.files.length)
      setSelected({ folders: [], files: [] });
    else
      setSelected({
        folders: folders.map((f) => f.name),
        files: files.map((f) => f.name),
      });
  };

  const isChecked = (name: string, isFolder: boolean) =>
    isFolder ? selected.folders.includes(name) : selected.files.includes(name);

  // Normalize path to avoid resets on trailing slash changes
  const normalizePath = (p: string) => (p.endsWith("/") ? p.slice(0, -1) : p);

  useEffect(() => {
    setSelected({ folders: [], files: [] });
  }, [normalizePath(currentPath)]);

  return (
    <main className="page-wrap px-4 pb-8 pt-14 text-sm">
      <Header
        currentPath={currentPath}
        selected={selected}
        filesArr={allFileAndFolders}
        files={files}
        folders={folders}
        handleToggleSelectAll={handleToggleSelectAll}
        totalSelected={totalSelected}
      />

      {isError && <p>Error</p>}
      {allFileAndFolders.length === 0 && !isLoading && <EmptyState />}
      {isLoading && (
        <div className="mt-10 flex flex-wrap gap-4">
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
          <Skeleton className="w-[100px] h-[160px] bg-gray-200/20 border" />
        </div>
      )}

      {allFileAndFolders.length > 0 && (
        <section className="mt-10">
          <div className="mt-10 flex flex-wrap gap-4">
            {folders.map((file, i) => (
              <FolderGridItem
                currentPath={currentPath}
                handleSelect={() => {
                  handleSelect(file.name, true);
                }}
                checked={isChecked(file.name, true)}
                file={file}
                key={file.name + i + "-folder"}
              />
            ))}
          </div>
          <div>
            <div className="mt-10 flex flex-wrap gap-4">
              {files.map((file, i) => (
                <FileGridItem
                  handleSelect={() => {
                    handleSelect(file.name, false);
                  }}
                  checked={isChecked(file.name, false)}
                  file={file}
                  key={file.name + i + "-file"}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

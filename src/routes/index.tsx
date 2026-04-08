import { FileGridItem } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderGridItem } from "#/components/folder";
import type { FileResponse, FileSection } from "@/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchArea } from "@/components/search";
import z from "zod";
import { EmptyState } from "#/components/empty-state";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Copy, Scissors, Trash } from "lucide-react";
import { Checkbox } from "#/components/ui/checkbox";

const productSearchSchema = z.object({
  path: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: productSearchSchema,
  loaderDeps: ({ search: { path } }) => ({ path }),
  loader: async ({ deps: { path } }): Promise<FileResponse> => {
    const query = new URLSearchParams();
    if (path) query.set("path", path);

    const url = `${import.meta.env.VITE_API_URL}/ls?${query.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch files: ${res.status} ${res.statusText}`,
        );
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Loader error:", error);
      throw error;
    }
  },
});

function App() {
  const { files: filesArr, currentPath } = Route.useLoaderData();
  const folders = filesArr.filter((file) => file.isDirectory);
  const files = filesArr.filter((file) => !file.isDirectory);

  const [selected, setSelected] = useState<FileSection>({
    folders: new Set(),
    files: new Set(),
  });

  const totalSelected = selected.folders.size + selected.files.size;

  const handleSelect = (index: number, isFolder: boolean) => {
    setSelected((prev) => {
      const next = {
        folders: new Set(prev.folders),
        files: new Set(prev.files),
      };

      if (isFolder) {
        if (next.folders.has(index)) next.folders.delete(index);
        else next.folders.add(index);
      } else {
        if (next.files.has(index)) next.files.delete(index);
        else next.files.add(index);
      }

      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (totalSelected == filesArr.length)
      setSelected({ folders: new Set(), files: new Set() });
    else
      setSelected({
        folders: new Set(folders.map((_, i) => i)),
        files: new Set(files.map((_, i) => i)),
      });
  };

  const isChecked = (index: number, isFolder: boolean) =>
    isFolder ? selected.folders.has(index) : selected.files.has(index);

  return (
    <main className="page-wrap px-4 pb-8 pt-14 text-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>
      <nav className="flex items-center justify-between">
        <Breadcrumbs currentPath={currentPath} />
      </nav>

      <nav className="flex gap-4 mt-4 items-center">
        {selected.files.size + selected.folders.size > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={totalSelected === filesArr.length}
                onCheckedChange={handleToggleSelectAll}
              />
              <p className="me-10">select all</p>
              <h1>{totalSelected} item(s) selected</h1>
            </div>

            <div className="flex gap-1">
              <Button size="icon" className="bg-gray-600 text-white">
                <Copy />
              </Button>
              <Button size="icon" className="bg-gray-600 text-white">
                <Scissors />
              </Button>
              <Button className="bg-red-700 text-gray-100 ms-4" size="icon">
                <Trash />
              </Button>
            </div>
          </div>
        )}
      </nav>

      {filesArr.length > 0 ? (
        <section className="mt-10">
          <div className="mt-10 flex flex-wrap gap-4">
            {folders.map((file, i) => (
              <FolderGridItem
                currentPath={currentPath}
                handleSelect={() => {
                  handleSelect(i, true);
                }}
                checked={isChecked(i, true)}
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
                    handleSelect(i, false);
                  }}
                  checked={isChecked(i, false)}
                  file={file}
                  key={file.name + i + "-file"}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

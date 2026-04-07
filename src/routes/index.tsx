import { FileGridItem } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderGridItem } from "#/components/folder";
import type { FileResponse } from "@/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchArea } from "@/components/search";
import z from "zod";

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

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>
      <nav className="flex items-center justify-between">
        <Breadcrumbs currentPath={currentPath} />
      </nav>

      <section className="mt-10">
        <h2>Folders</h2>
        <div className="mt-10 flex flex-wrap gap-4">
          {folders.map((file, i) => (
            <FolderGridItem
              currentPath={currentPath}
              file={file}
              key={file.name + i + "-folder"}
            />
          ))}
        </div>
        <div>
          <div className="mt-10 flex flex-wrap gap-4">
            {files.map((file, i) => (
              <FileGridItem file={file} key={file.name + i + "-file"} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

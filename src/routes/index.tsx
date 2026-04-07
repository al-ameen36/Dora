import { FileGridItem } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderGridItem } from "#/components/folder";
import type { FileType } from "@/types";
import { Breadcrumbs } from "@/components/breadcrumbs";
import z from "zod";
import { SearchArea } from "#/components/search";

const productSearchSchema = z.object({
  path: z.string().optional(),
});

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: productSearchSchema,
  loader: async (): Promise<FileType[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ls`);
    const data = await res.json();
    return data.files;
  },
});

function App() {
  const data = Route.useLoaderData();
  const { path } = Route.useSearch();

  const folders = data.filter((file) => file.isDirectory);
  const files = data.filter((file) => !file.isDirectory);

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>
      <nav className="flex items-center justify-between">
        <Breadcrumbs path={path || ""} />
      </nav>

      <section className="mt-10">
        <h2>Folders</h2>
        <div className="mt-10 flex flex-wrap gap-4">
          {folders.map((file, i) => (
            <FolderGridItem file={file} key={file.name + i + "-folder"} />
          ))}
        </div>
      </section>
      <section className="mt-10">
        <div>
          <h2>Files</h2>
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

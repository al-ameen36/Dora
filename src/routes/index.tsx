import { FileGridItem } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderGridItem } from "#/components/folder";
import type { FileType } from "@/types";

export const Route = createFileRoute("/")({
  component: App,
  loader: async (): Promise<FileType[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/ls`);
    const data = await res.json();
    return data.files;
  },
});

function App() {
  const data = Route.useLoaderData();

  const folders = data.filter((file) => file.isDirectory);
  const files = data.filter((file) => !file.isDirectory);

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1>Dora</h1>
      <nav></nav>

      <section>
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

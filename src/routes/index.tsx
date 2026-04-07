import { FileItemGrid, type FileType } from "@/components/file";
import { createFileRoute } from "@tanstack/react-router";
import { FolderItem } from "#/components/folder";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const folders = filesData.filter((file) => !file.filename.includes("."));
  const files = filesData.filter((file) => file.filename.includes("."));

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1>Dora</h1>
      <nav></nav>

      <section>
        <h2>Folders</h2>
        <div className="mt-10 flex flex-wrap gap-4">
          {folders.map((file) => (
            <FolderItem file={file} key={file.id} />
          ))}
        </div>
      </section>
      <section className="mt-10">
        <div>
          <h2>Files</h2>
          <div className="mt-10 flex flex-wrap gap-4">
            {files.map((file) => (
              <FileItemGrid file={file} key={file.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const filesData: FileType[] = [
  { filename: "somefile.txt", size: "10mb", id: 1 },
  { filename: "somedirectory", size: "10mb", id: 2 },
  { filename: "somedirectory", size: "10mb", id: 3 },
  { filename: "somefile.mp4", size: "10mb", id: 4 },
  { filename: "somefile.mp3", size: "10mb", id: 5 },

  { filename: "somefile.txt", size: "10mb", id: 6 },
  { filename: "somedirectory", size: "10mb", id: 7 },
  { filename: "somedirectory", size: "10mb", id: 8 },
  { filename: "somefile.mp4", size: "10mb", id: 9 },
  { filename: "somefile.mp3", size: "10mb", id: 10 },
];

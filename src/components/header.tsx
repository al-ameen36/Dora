import { cn } from "@/lib/utils";
import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Clipboard, Copy, Scissors, Trash } from "lucide-react";
import type { FileResponse, FileSection, FileType } from "@/types";
import { useEffect, useState } from "react";
import { copyFile, deleteFile } from "@/functions/file-ops";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  selected: FileSection;
  totalSelected: number;
  filesArr: FileType[];
  files: FileType[];
  folders: FileType[];
  currentPath: string;
  handleToggleSelectAll: () => void;
};

export default function Header({
  selected,
  totalSelected,
  filesArr,
  currentPath,
  handleToggleSelectAll,
}: Props) {
  const queryClient = useQueryClient();
  const [scrolled, setScrolled] = useState(false);
  const [localSelected, setLocalSelected] = useState<{
    folders: string[];
    files: string[];
    from: string;
  }>({
    folders: [],
    files: [],
    from: "",
  });

  const copyFiles = useMutation({
    mutationFn: copyFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls"] });

      const oldSnapShot = queryClient.getQueriesData<FileResponse>({ queryKey: ["ls"] });

      queryClient.setQueriesData<FileResponse>({ queryKey: ["ls"] }, (prev) => {
        if (!prev) return undefined;

        const newFiles = variables.data.files.map<FileType>((f) => ({
          name: f,
          fullPath: `${variables.data.to}/${f}`,
          isDirectory: false, // Fallback, will fix on refetch
          size: -1,
        }));

        return {
          ...prev,
          files: [...prev.files, ...newFiles],
        };
      });

      return { oldSnapShot };
    },
    onError: (_err, _variables, context) => {
      if (context?.oldSnapShot) {
        context.oldSnapShot.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ls"] });
    },
  });

  const deleteFiles = useMutation({
    mutationFn: deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ls"] });
    },
  });

  const handleCopy = async () => {
    setLocalSelected({
      folders: [...selected.folders],
      files: [...selected.files],
      from: currentPath,
    });
  };

  const handlePaste = async () => {
    try {
      copyFiles.mutate({
        data: {
          to: currentPath,
          files: localSelected.files.concat(localSelected.folders),
        },
      });

      setLocalSelected({ folders: [], files: [], from: "" });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      deleteFiles.mutate({
        data: {
          files: selected.files.concat(selected.folders),
        },
      });

      setLocalSelected({ folders: [], files: [], from: "" });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 px-4",
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b shadow-xs py-4 rounded-xs"
          : "bg-transparent border-b-transparent py-4",
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>

      <nav className="flex items-center justify-between mt-4 h-[20px]">
        <Breadcrumbs currentPath={currentPath} />
      </nav>

      <nav className="flex gap-4 mt-4 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              name="selectAll"
              checked={totalSelected === filesArr.length}
              onCheckedChange={handleToggleSelectAll}
            />
            <label htmlFor="selectAll" className="me-10">
              Select all ({totalSelected}/{filesArr.length})
            </label>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={handleCopy}
              disabled={totalSelected === 0}
            >
              <Copy />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              disabled={totalSelected === 0}
            >
              <Scissors />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={handlePaste}
              disabled={
                localSelected.files.length + localSelected.folders.length === 0
              }
            >
              <Clipboard />
            </Button>
            <Button
              className="bg-red-700 text-gray-100 ms-4"
              size="icon"
              onClick={handleDelete}
              disabled={totalSelected === 0}
            >
              <Trash />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

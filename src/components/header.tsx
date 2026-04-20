import { cn } from "@/lib/utils";
import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Clipboard, Copy, Scissors, Trash } from "lucide-react";
import type { Action, FileResponse, FileType } from "@/types";
import { useEffect, useState } from "react";
import { copyFile, deleteFile, getFiles, moveFile } from "@/functions/file-ops";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  currentPathAtom,
  selectedItemsAtom,
  totalSelectedAtom,
} from "@/store/atoms/files";
import { useFileActions } from "@/hooks/file-actions";

export default function Header() {
  const queryClient = useQueryClient();
  const selectedItems = useAtomValue(selectedItemsAtom);
  const totalSelectedItems = useAtomValue(totalSelectedAtom);
  const [scrolled, setScrolled] = useState(false);
  const [action, setAction] = useState<Action>("NONE");
  const [committedSelection, setCommitedSelection] = useState<FileType[]>([]);
  const currentPath = useAtomValue(currentPathAtom);
  const { data } = useQuery({
    queryKey: ["ls", currentPath],
    queryFn: () => getFiles({ data: { path: currentPath } }),
  });
  const totalCount = data?.files.length;
  const { handleResetSelection, handleToggleSelectAll, normalizePath } =
    useFileActions();

  const copyFiles = useMutation({
    mutationFn: copyFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls"] });

      const oldSnapShot = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls"],
      });

      queryClient.setQueriesData<FileResponse>({ queryKey: ["ls"] }, (prev) => {
        if (!prev) return undefined;

        const newFiles = variables.data.files.map<FileType>((f) => ({
          name: f.name,
          fullPath: `${variables.data.to}/${f.name}`,
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

  const moveFiles = useMutation({
    mutationFn: moveFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls"] });

      const oldSnapShot = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls"],
      });

      queryClient.setQueriesData<FileResponse>({ queryKey: ["ls"] }, (prev) => {
        if (!prev) return undefined;

        const newFiles = variables.data.files.map<FileType>((f) => ({
          name: f.name,
          fullPath: `${variables.data.to}/${f.name}`,
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

  const handleSetupAction = async (action: Action) => {
    setCommitedSelection([...selectedItems]);
    setAction(action);
  };

  const handlePaste = async () => {
    try {
      if (action === "COPY")
        copyFiles.mutate({
          data: {
            to: currentPath,
            files: committedSelection,
          },
        });
      else if (action === "MOVE")
        moveFiles.mutate({
          data: {
            to: currentPath,
            files: committedSelection,
          },
        });

      handleResetSelection();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      deleteFiles.mutate({
        data: {
          files: selectedItems,
        },
      });

      handleResetSelection();
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

  useEffect(() => {
    handleResetSelection();
  }, [normalizePath(currentPath)]);

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
        <Breadcrumbs />
      </nav>

      <nav className="flex gap-4 mt-4 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              name="selectAll"
              checked={totalSelectedItems === selectedItems.length}
              onCheckedChange={handleToggleSelectAll}
            />
            <label htmlFor="selectAll" className="me-10">
              Select all ({totalSelectedItems}/{totalCount})
            </label>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={() => handleSetupAction("COPY")}
              disabled={totalSelectedItems === 0}
            >
              <Copy />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={() => handleSetupAction("MOVE")}
              disabled={totalSelectedItems === 0}
            >
              <Scissors />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={handlePaste}
              disabled={committedSelection.length === 0}
            >
              <Clipboard />
            </Button>
            <Button
              className="bg-red-700 text-gray-100 ms-4"
              size="icon"
              onClick={handleDelete}
              disabled={totalSelectedItems === 0}
            >
              <Trash />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

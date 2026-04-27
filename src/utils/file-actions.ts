import { getFiles } from "@/functions/file-ops";
import {
  currentPathAtom,
  selectedItemsAtom,
  totalSelectedAtom,
} from "@/state/files";
import type { FileType } from "@/types/files";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";

export const useFileActions = () => {
  const [selectedItems, setSelectedItems] = useAtom(selectedItemsAtom);
  const totalSelectedItems = useAtomValue(totalSelectedAtom);
  const currentPath = useAtomValue(currentPathAtom);
  const { data } = useQuery({
    queryKey: ["ls", currentPath],
    queryFn: () => getFiles({ data: { path: currentPath } }),
  });
  const navigate = useNavigate({ from: "/" });

  const handleOpenFolder = (path: string) => {
    const safePath = path;

    navigate({
      search: (prev) => ({ ...prev, path: safePath }),
    });
  };

  const handleSelect = (file: FileType) => {
    const found = selectedItems.find((f) => f.fullPath === file.fullPath);
    if (!found) setSelectedItems((prev) => [...prev, file]);
    else
      setSelectedItems((prev) =>
        prev.filter((f) => f.fullPath !== file.fullPath),
      );
  };

  const handleToggleSelectAll = () => {
    if (!data) return;

    if (totalSelectedItems === data?.files.length) setSelectedItems([]);
    else setSelectedItems(data?.files.map((file) => file));
  };

  const handleResetSelection = () => {
    setSelectedItems([]);
  };

  const isChecked = (file: FileType) =>
    Boolean(selectedItems.find((f) => f.name === file.name));

  // Normalize path to avoid resets on trailing slash changes
  const normalizePath = (p: string) => (p.endsWith("/") ? p.slice(0, -1) : p);

  return {
    handleOpenFolder,
    handleSelect,
    handleToggleSelectAll,
    isChecked,
    normalizePath,
    handleResetSelection,
  };
};

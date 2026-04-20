import { getFiles } from "@/functions/file-ops";
import {
  currentPathAtom,
  selectedItemsAtom,
  totalSelectedAtom,
} from "@/store/atoms/files";
import type { FileType } from "@/types";
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
    const safePath = encodeURIComponent(path);

    navigate({
      search: (prev) => ({ ...prev, path: safePath }),
    });
  };

  const handleSelect = (file: FileType) => {
    setSelectedItems((prev) => [...prev, file]);
  };

  const handleToggleSelectAll = () => {
    if (totalSelectedItems === data?.files.length) setSelectedItems([]);
    else setSelectedItems((prev) => [...prev]);
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

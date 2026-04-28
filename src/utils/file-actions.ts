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
    navigate({
      search: (prev) => ({ ...prev, path }),
    });
  };

  const handleSelect = (file: FileType) => {
    const found = selectedItems.files.find((f) => f.fullPath === file.fullPath);
    if (!found)
      setSelectedItems((prev) => ({
        from: currentPath,
        to: "",
        files: [...prev.files, file],
      }));
    else
      setSelectedItems((prev) => ({
        ...prev,
        selectedFrom: currentPath,
        files: prev.files.filter((f) => f.fullPath !== file.fullPath),
      }));
  };

  const handleResetSelection = () => {
    setSelectedItems({ files: [], from: "", to: "" });
  };

  const handleToggleSelectAll = () => {
    if (!data) return;

    if (totalSelectedItems === data?.files.length) handleResetSelection();
    else
      setSelectedItems({
        files: data?.files.map((file) => file),
        from: currentPath,
        to: "",
      });
  };

  const isChecked = (file: FileType) =>
    Boolean(selectedItems.files.find((f) => f.fullPath === file.fullPath));

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

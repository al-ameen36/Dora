import { Copy, Scissors, Trash, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useFileActions } from "@/utils/file-actions";
import { useEffect, useState } from "react";
import type { Action, FileSelection } from "@/types/files";
import { useAtomValue } from "jotai";
import {
  currentPathAtom,
  selectedItemsAtom,
  totalSelectedAtom,
} from "@/state/files";
import { useFilesAPI } from "@/services/files";

export default function ActionsBar() {
  const [action, setAction] = useState<Action>("NONE");
  const currentPath = useAtomValue(currentPathAtom);
  const [committedSelection, setCommitedSelection] = useState<FileSelection>({
    files: [],
    from: "",
    to: currentPath,
  });
  const selectedItems = useAtomValue(selectedItemsAtom);
  const totalSelectedItems = useAtomValue(totalSelectedAtom);

  const { data, copyFiles, moveFiles, deleteFiles } = useFilesAPI();
  const totalCount = data?.files.length;
  const { handleResetSelection, handleToggleSelectAll, normalizePath } =
    useFileActions();
  const handleSetupAction = async (action: Action) => {
    setCommitedSelection({ ...selectedItems });
    setAction(action);
  };

  const clearAllSelections = () => {
    handleResetSelection();
    setCommitedSelection({ files: [], from: "", to: "" });
    setAction("NONE");
  };

  const handlePaste = async () => {
    if (action === "COPY")
      copyFiles.mutate({
        data: {
          from: committedSelection.from,
          to: currentPath,
          files: committedSelection.files,
        },
      });
    else if (action === "MOVE")
      moveFiles.mutate({
        data: {
          from: committedSelection.from,
          to: currentPath,
          files: committedSelection.files,
        },
      });

    clearAllSelections();
  };

  const handleDelete = async () => {
    deleteFiles.mutate({
      data: {
        files: selectedItems.files,
        currentPath,
      },
    });

    clearAllSelections();
  };

  useEffect(() => {
    handleResetSelection();
  }, [normalizePath(currentPath)]);

  return (
    <nav className="flex gap-4 mt-4 items-center">
      <div className="flex items-center gap-2">
        {selectedItems.files.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-600/80 hover:bg-gray-200/70 hover:text-black rounded-xs p-2">
            <Checkbox
              className="outline-red-400"
              name="selectAll"
              id="selectAll"
              checked={totalSelectedItems === data?.files.length}
              onCheckedChange={handleToggleSelectAll}
            />
            <label htmlFor="selectAll" className="cursor-pointer">
              ({totalSelectedItems}/{totalCount})
            </label>
          </div>
        )}

        <div className="flex gap-1">
          <Button
            size="icon"
            className="border-gray-200/30 bg-gray-600 text-white hover:text-black rounded-xs"
            onClick={() => handleSetupAction("COPY")}
            disabled={totalSelectedItems === 0}
          >
            <Copy />
          </Button>
          <Button
            size="icon"
            className="bg-gray-600 border-gray-200/30 text-white hover:text-black rounded-xs"
            onClick={() => handleSetupAction("MOVE")}
            disabled={totalSelectedItems === 0}
          >
            <Scissors />
          </Button>
          <Button
            size="icon"
            className="bg-gray-600 border-gray-200/30 text-white hover:text-black rounded-xs"
            onClick={handlePaste}
            disabled={committedSelection.files.length === 0}
          >
            <Clipboard />
          </Button>
          <Button
            className="bg-red-700 text-white hover:text-black ms-4 rounded-xs"
            size="icon"
            onClick={handleDelete}
            disabled={totalSelectedItems === 0}
          >
            <Trash />
          </Button>
        </div>
      </div>
    </nav>
  );
}

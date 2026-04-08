import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Pencil, Scissors, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

type Props = {
  file: FileType;
  currentPath: string;
  handleSelect: () => void;
  checked: boolean;
};

export function FolderGridItem({
  file,
  currentPath,
  handleSelect,
  checked,
}: Props) {
  const navigate = useNavigate({ from: "/" });
  const newPath = [currentPath, file.name].join("/");
  const safePath = encodeURIComponent(newPath);

  const handleOpenFolder = () => {
    navigate({
      search: (prev) => ({ ...prev, path: safePath }),
    });
  };

  return (
    <button
      onClick={handleOpenFolder}
      className="relative flex justify-between items-end w-[100px] h-[140px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-10 absolute top-2 left-2"
      >
        <Checkbox checked={checked} onCheckedChange={() => handleSelect()} />
      </div>
      <ContextMenu>
        <ContextMenuTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <img
                  className="mx-auto"
                  src="/icons/folder.png"
                  alt=""
                  width={90}
                />
                <p className="text-sm line-clamp-2">{file.name}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{file.name}</p>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Copy /> Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors /> Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <Pencil /> Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <Trash /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </button>
  );
}

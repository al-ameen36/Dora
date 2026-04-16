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
import { Copy, LucideLoader2, Pencil, Scissors, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { getFileName, getFileNameFromPath } from "@/lib/helpers";

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
    <article
      onClick={handleOpenFolder}
      className="w-[100px] h-[170px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm"
    >
      {file.size === -1 ? (
        <div className="absolute top-0 left-0 bg-black/20 w-full h-full grid place-items-center">
          <LucideLoader2 className="animate-spin" />
          <p>{getFileNameFromPath(file.name)}</p>
        </div>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger>
            <div onClick={(e) => e.stopPropagation()} className="">
              <Checkbox
                checked={checked}
                onCheckedChange={() => handleSelect()}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <img
                    className="mx-auto"
                    src="/icons/folder.png"
                    alt=""
                    width={90}
                  />
                  <p className="text-center">{getFileName(file.name, true)}</p>
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
      )}
    </article>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types/files";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Pencil, Scissors, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import {
  getFileIcon,
  getFileName,
  getFileNameFromPath,
  getFileSize,
} from "@/lib/helpers";
import PendingFile from "./pending-file";
import { useFileActions } from "@/utils/file-actions";
import { useState } from "react";

type Props = {
  file: FileType;
};

export function GridItem({ file }: Props) {
  const { handleSelect, isChecked, handleOpenFolder } = useFileActions();

  const handleOpen = file.isDirectory
    ? () => handleOpenFolder(file.fullPath)
    : () => {};

  return (
    <article
      onClick={handleOpen}
      className="relative w-[100px] h-[170px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm"
    >
      {file.size === -1 ? (
        <PendingFile name={getFileNameFromPath(file.name)} />
      ) : (
        <ContextMenu>
          <ContextMenuTrigger>
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isChecked(file)}
                onCheckedChange={() => handleSelect(file)}
              />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                {file.isDirectory ? (
                  <Folder file={file} />
                ) : (
                  <File file={file} />
                )}
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

type ItemProps = {
  file: FileType;
};

// FOLDERS
function Folder({ file }: ItemProps) {
  return (
    <div className="w-full">
      <img className="mx-auto" src="/icons/folder.png" alt="" width={90} />
      <p className="text-center">{getFileName(file.name, true)}</p>
    </div>
  );
}

// FILES
function File({ file }: ItemProps) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);
  return (
    <div className="w-full">
      <img
        onError={() => setSrc("file.png")}
        className="mx-auto"
        src={`/icons/${src}`}
        alt=""
        width={70}
      />
      <p className="mt-2 h-[42px] text-center">{getFileName(file.name)}</p>
      <p className="text-xs text-gray-500">{getFileSize(file.size)}</p>
    </div>
  );
}

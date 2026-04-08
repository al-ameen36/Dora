import { getFileIcon, getFileSize } from "@/lib/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

type Props = {
  file: FileType;
  currentPath: string;
  handleSelect: () => void;
  checked: boolean;
};

export function FileInlineItem({
  file,
  currentPath,
  handleSelect,
  checked,
}: Props) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);

  return (
    <button className="flex justify-between cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm items-center">
      <div onClick={(e) => e.stopPropagation()} className="z-10 absolute">
        <Checkbox checked={checked} onCheckedChange={() => handleSelect()} />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex gap-3 items-center">
            <img
              src={`/icons/${src}`}
              onError={() => setSrc("file.png")}
              alt=""
              width={30}
            />

            <p className="text-sm line-clamp-2">{file.name}</p>
          </div>
          <p className="text-sm">{file.size}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{file.name}</p>
        </TooltipContent>
      </Tooltip>
    </button>
  );
}

export function FileGridItem({
  file,
  currentPath,
  handleSelect,
  checked,
}: Props) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);

  return (
    <button className="relative flex justify-between items-end w-[100px] h-[170px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-10 absolute top-2 left-2"
      >
        <Checkbox checked={checked} onCheckedChange={() => handleSelect()} />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <img
              onError={() => setSrc("file.png")}
              className="mx-auto"
              src={`/icons/${src}`}
              alt=""
              width={70}
            />

            <p className="text-sm line-clamp-2 mt-2 h-[42px]">{file.name}</p>
            <p className="text-xs text-gray-500">{getFileSize(file.size)}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{file.name}</p>
        </TooltipContent>
      </Tooltip>
    </button>
  );
}

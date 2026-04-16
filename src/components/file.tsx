import {
  getFileIcon,
  getFileName,
  getFileNameFromPath,
  getFileSize,
} from "@/lib/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { LucideLoader2 } from "lucide-react";
import PendingFile from "./pending-file";

type Props = {
  file: FileType;
  handleSelect: () => void;
  checked: boolean;
};

export function FileInlineItem({ file, handleSelect, checked }: Props) {
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

export function FileGridItem({ file, handleSelect, checked }: Props) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);

  return (
    <article
      className={
        "w-[100px] h-[170px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm relative"
      }
    >
      {file.size === -1 ? (
        <PendingFile name={getFileNameFromPath(file.name)} />
      ) : (
        <>
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={checked}
              onCheckedChange={() => handleSelect()}
            />
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
                <p className="mt-2 h-[42px] text-center">
                  {getFileName(file.name)}
                </p>
                <p className="text-xs text-gray-500">
                  {getFileSize(file.size)}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{file.name}</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </article>
  );
}

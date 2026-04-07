import { getFileIcon } from "@/lib/helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";
import { useState } from "react";

export function FileInlineItem({ file }: { file: FileType }) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);

  return (
    <article className="flex justify-between cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm items-center">
      <div className="flex gap-3 items-center">
        <img src={src} onError={() => setSrc("/file.png")} alt="" width={30} />

        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2">{file.name}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.name}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm">{file.size}</p>
    </article>
  );
}

export function FileGridItem({ file }: { file: FileType }) {
  const [src, setSrc] = useState(`${getFileIcon(file.name)}`);

  return (
    <article className="flex justify-between max-w-[90px] h-[150px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm">
      <div>
        <img
          src={src}
          onError={() => {
            if (src !== "/icons/file.png") {
              setSrc("/icons/file.png");
            }
          }}
          alt=""
          width={70}
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2 mt-2">{file.name}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.name}</p>
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
    </article>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";

export function FolderGridItem({ file }: { file: FileType }) {
  return (
    <article className="flex justify-between max-w-[90px] h-[130px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm">
      <div>
        <img src="/folder.png" alt="" width={90} />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2">{file.name}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.name}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </article>
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FileType } from "@/types";
import { Link } from "@tanstack/react-router";

type Props = {
  file: FileType;
  currentPath: string;
};

export function FolderGridItem({ file, currentPath }: Props) {
  const newPath = [currentPath, file.name].join("/");
  const safePath = encodeURIComponent(newPath);

  return (
    <Link
      to="/"
      search={{ path: safePath }}
      className="flex justify-between w-[100px] h-[130px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <img className="mx-auto" src="/folder.png" alt="" width={90} />
            <p className="text-sm line-clamp-2">{file.name}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{file.name}</p>
        </TooltipContent>
      </Tooltip>
    </Link>
  );
}

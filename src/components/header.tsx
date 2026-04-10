import { cn } from "@/lib/utils";
import { SearchArea } from "./search";
import { Breadcrumbs } from "./breadcrumbs";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Clipboard, Copy, Scissors, Trash } from "lucide-react";
import type { FileSection, FileType } from "@/types";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { copyFile } from "@/functions/file-ops";

type Props = {
  selected: FileSection;
  totalSelected: number;
  filesArr: FileType[];
  files: FileType[];
  folders: FileType[];
  currentPath: string;
  handleToggleSelectAll: () => void;
};

export default function Header({
  selected,
  totalSelected,
  filesArr,
  currentPath,
  handleToggleSelectAll,
}: Props) {
  const copyFiles = useServerFn(copyFile);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState<{
    folders: string[];
    files: string[];
    from: string;
  }>({
    folders: [],
    files: [],
    from: "",
  });

  const handleCopy = async () => {
    setCopied({
      folders: [...selected.folders],
      files: [...selected.files],
      from: currentPath,
    });
  };

  const handlePaste = async () => {
    try {
      await copyFiles({
        data: {
          from: copied.from,
          to: currentPath,
          files: copied.files,
          folders: copied.folders,
        },
      });

      setCopied({ folders: [], files: [], from: "" });
      console.log(123);
      console.log(copied);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 px-4",
        scrolled
          ? "bg-black/70 backdrop-blur-md border-b shadow-xs py-4 rounded-xs"
          : "bg-transparent border-b-transparent py-4",
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dora</h1>
        <div className="w-100">
          <SearchArea />
        </div>
      </div>

      <nav className="flex items-center justify-between mt-4 h-[20px]">
        <Breadcrumbs currentPath={currentPath} />
      </nav>

      <nav className="flex gap-4 mt-4 items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              name="selectAll"
              checked={totalSelected === filesArr.length}
              onCheckedChange={handleToggleSelectAll}
            />
            <label htmlFor="selectAll" className="me-10">
              Select all ({totalSelected}/{filesArr.length})
            </label>
          </div>

          <div className="flex gap-1">
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={handleCopy}
              disabled={totalSelected === 0}
            >
              <Copy />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              disabled={totalSelected === 0}
            >
              <Scissors />
            </Button>
            <Button
              size="icon"
              className="bg-gray-600 text-white"
              onClick={handlePaste}
              disabled={copied.files.length + copied.folders.length === 0}
            >
              <Clipboard />
            </Button>
            <Button
              className="bg-red-700 text-gray-100 ms-4"
              size="icon"
              disabled={totalSelected === 0}
            >
              <Trash />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

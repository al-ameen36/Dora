import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FileType = {
  id: number;
  filename: string;
  size: string;
};

export function FileItemInline({ file }: { file: FileType }) {
  return (
    <article className="flex justify-between cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm items-center">
      <div className="flex gap-3 items-center">
        <img src="/doc.png" alt="" width={30} />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2">{file.filename}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.filename}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <p className="text-sm">{file.size}</p>
    </article>
  );
}

export function FileItemGrid({ file }: { file: FileType }) {
  return (
    <article className="flex justify-between max-w-[90px] h-[150px] cursor-pointer bg-gray-200/3 hover:bg-gray-200/10 border p-2 rounded-sm">
      <div>
        <img
          src={getFileIcon(file.filename)}
          onError={({ currentTarget }) => (currentTarget.src = "/file.png")}
          alt=""
          width={70}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm line-clamp-2 mt-2">{file.filename}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{file.filename}</p>
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-gray-500">{file.size}</p>
      </div>
    </article>
  );
}

export const fileTypeIcons = {
  // Documents
  pdf: "pdf.png",
  doc: "doc.png",
  docx: "doc.png",
  xls: "xls.png",
  xlsx: "xls.png",
  ppt: "ppt.png",
  pptx: "ppt.png",
  txt: "txt.png",
  rtf: "txt.png",
  md: "md.png",

  // Images
  jpg: "image.png",
  jpeg: "image.png",
  png: "image.png",
  gif: "image.png",
  webp: "image.png",
  svg: "image.png",
  bmp: "image.png",

  // Audio
  mp3: "audio.png",
  wav: "audio.png",
  ogg: "audio.png",
  m4a: "audio.png",
  flac: "audio.png",

  // Video
  mp4: "video.png",
  mkv: "video.png",
  avi: "video.png",
  mov: "video.png",
  webm: "video.png",

  // Archives
  zip: "archive.png",
  rar: "archive.png",
  "7z": "archive.png",
  tar: "archive.png",
  gz: "archive.png",

  // Code / Dev
  js: "code.png",
  ts: "code.png",
  jsx: "react.png",
  tsx: "react.png",
  html: "html.png",
  css: "css.png",
  scss: "css.png",
  json: "json.png",
  xml: "xml.png",
  yml: "yaml.png",
  yaml: "yaml.png",
  sh: "terminal.png",

  // Executables
  exe: "exe.png",
  apk: "apk.png",
  app: "app.png",

  // Fonts
  ttf: "font.png",
  otf: "font.png",
  woff: "font.png",
  woff2: "font.png",

  // Fallback
  default: "file.png",
};

const getFileIcon = (filename: string) => {
  const ext = filename.split(".")[1];
  return (
    fileTypeIcons[ext as keyof typeof fileTypeIcons] || fileTypeIcons.default
  );
};

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
  zip: "zip.png",
  rar: "zip.png",
  "7z": "zip.png",
  tar: "zip.png",
  gz: "zip.png",

  // Code / Dev
  js: "script.png",
  ts: "script.png",
  jsx: "script.png",
  tsx: "script.png",
  html: "script.png",
  css: "script.png",
  scss: "script.png",
  json: "script.png",
  xml: "script.png",
  yml: "script.png",
  yaml: "script.png",
  sh: "cmd.png",

  // Executables
  exe: "exe.png",

  // Fonts
  ttf: "font.png",
  otf: "font.png",
  woff: "font.png",
  woff2: "font.png",

  // Fallback
  default: "file.png",
};

export const getFileExtension = (name: string) => {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
};

export const getFileName = (name: string, isFolder: boolean = false) => {
  const extension = getFileExtension(name);
  const maxLength = isFolder ? 15 : extension ? 12 : 22;
  const nameWithoutExtension = name.replace(`.${extension}`, "");
  const shortName = nameWithoutExtension.slice(0, maxLength);
  const separator = nameWithoutExtension.length > maxLength ? "..." : "";

  if (isFolder) return shortName + separator;
  return shortName + separator + (extension ? "." + extension : "");
};

export const getFileNameFromPath = (
  name: string,
  isFolder: boolean = false,
) => {
  const nameParts = name.split("/");
  const namePart = nameParts[nameParts.length - 1];
  return getFileName(namePart, isFolder);
};

export const getFileIcon = (name: string) => {
  const ext = getFileExtension(name);
  return (
    fileTypeIcons[ext as keyof typeof fileTypeIcons] || fileTypeIcons.default
  );
};

export const getFileSize = (size: number) => {
  const sizes = {
    KB: 1000,
    MB: 1000 * 1000,
    GB: 1000 * 1000 * 1000,
  };

  if (size >= sizes.GB) {
    return `${(size / sizes.GB).toFixed(2)} GB`;
  }
  if (size >= sizes.MB) {
    return `${(size / sizes.MB).toFixed(2)} MB`;
  }
  if (size >= sizes.KB) {
    return `${(size / sizes.KB).toFixed(2)} KB`;
  }
  return `${size} B`;
};

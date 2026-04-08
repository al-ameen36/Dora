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

const getFileExtension = (name: string) => {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
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

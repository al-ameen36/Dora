export type FileType = {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  size: number;
};

export type FileResponse = {
  files: FileType[];
  currentPath: string;
};

export type FileSection = {
  folders: string[];
  files: string[];
};

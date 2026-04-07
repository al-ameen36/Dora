export type FileType = {
  name: string;
  isDirectory: boolean;
  size: number;
};

export type FileResponse = {
  files: FileType[];
  currentPath: string;
};

export type FileType = {
  name: string;
  isDirectory: boolean;
  size: number;
};

export type FileResponse = {
  files: FileType[];
  currentPath: string;
};

export type FileSection = {
  folders: Set<number>;
  files: Set<number>;
};

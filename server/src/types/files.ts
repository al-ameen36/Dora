export type FileType = {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  size: number | null;
};

export type FileActionBase = {
  files: FileType[];
  to: string;
  from: string;
};

export type CopyActionPayload = FileActionBase;
export type PasteActionPayload = FileActionBase;
export type DeleteActionPayload = Omit<FileActionBase, "to"> & {
  currentPath: string;
};
export type OpenctionPayload = { files: FileType[] };

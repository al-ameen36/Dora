export type FileType = {
  name: string;
  fullPath: string;
  isDirectory: boolean;
  size: number;
};

export type FileActionBase = {
  files: FileType[];
  to: string;
};

export type CopyActionPayload = FileActionBase;

export type PasteActionPayload = FileActionBase;
export type DeleteActionPayload = FileActionBase;

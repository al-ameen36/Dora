import z from "zod";

export const FileTypeSchema = z.object({
  name: z.string(),
  fullPath: z.string(),
  isDirectory: z.boolean(),
  size: z.number(),
});

export type FileType = z.infer<typeof FileTypeSchema>;

export type FileResponse = {
  files: FileType[];
  currentPath: string;
};

export type Action = "COPY" | "MOVE" | "PASTE" | "NONE";

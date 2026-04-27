import { FileTypeSchema, type FileResponse } from "@/types/files";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getFiles = createServerFn()
  .inputValidator(
    z.object({
      path: z
        .string()
        .regex(
          /^((?!\.\.[/\\]).)*$/,
          "Directory traversal sequences (../) are not allowed",
        )
        .optional(),
    }),
  )
  .handler(async ({ data: { path } }): Promise<FileResponse> => {
    const query = new URLSearchParams();
    if (path) query.set("path", path);

    const url = `${import.meta.env.VITE_API_URL}/ls?${query.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch files: ${res.status} ${res.statusText}`,
        );
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Loader error:", error);
      return { files: [], currentPath: "/" };
    }
  });

const copyFilesSchema = z.object({
  from: z.string(),
  to: z.string(),
  files: z.array(FileTypeSchema),
});

export const copyFile = createServerFn({ method: "POST" })
  .inputValidator(copyFilesSchema)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (!res.ok) {
      throw new Error(`Failed to copy file: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  });

const moveFilesSchema = z.object({
  from: z.string(),
  to: z.string(),
  files: z.array(FileTypeSchema),
});

export const moveFile = createServerFn({ method: "POST" })
  .inputValidator(moveFilesSchema)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (!res.ok) {
      throw new Error(`Failed to move file: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  });

const deleteFileSchema = z.object({
  files: z.array(FileTypeSchema),
  currentPath: z.string(),
});

export const deleteFile = createServerFn({ method: "POST" })
  .inputValidator(deleteFileSchema)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete file: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  });

const openFileSchema = z.object({
  files: z.array(FileTypeSchema),
});

export const openFile = createServerFn({ method: "GET" })
  .inputValidator(openFileSchema)
  .handler(async ({ data }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/open`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (!res.ok) {
      throw new Error(`Failed to open file: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  });

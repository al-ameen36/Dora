import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const copyFileSchema = z.object({
  from: z.string(),
  to: z.string(),
  files: z.array(z.string()),
  folders: z.array(z.string()),
});

export const copyFile = createServerFn({ method: "POST" })
  .inputValidator(copyFileSchema)
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

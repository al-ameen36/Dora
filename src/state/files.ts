import type { FileSelection, FileType } from "@/types/files";
import { atom } from "jotai";

export const allItemsAtom = atom<FileType[]>([]);
export const totalCountAtom = atom(
  (get) => get(selectedItemsAtom).files.length,
);

export const currentPathAtom = atom("");

export const selectedItemsAtom = atom<FileSelection>({
  files: [],
  to: "",
  from: "",
});
export const totalSelectedAtom = atom(
  (get) => get(selectedItemsAtom).files.length,
);

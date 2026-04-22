import type { FileType } from "@/types/files";
import { atom } from "jotai";

export const allItemsAtom = atom<FileType[]>([]);
export const totalCountAtom = atom((get) => get(selectedItemsAtom).length);

export const currentPathAtom = atom("");

export const selectedItemsAtom = atom<FileType[]>([]);
export const totalSelectedAtom = atom((get) => get(selectedItemsAtom).length);

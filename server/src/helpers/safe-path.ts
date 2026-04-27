import path from "path";

export function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export function getSafePath(root_dir: string, currentPath: string) {
  const newPath = decodeURIComponent(currentPath).replace(root_dir, "");

  return path.join(root_dir, newPath);
}

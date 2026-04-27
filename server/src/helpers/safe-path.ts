import path from "path";
import os from "os";

export function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

const ROOT_DIR = os.homedir();

export function getSafePath(currentPath: string) {
  if (!currentPath || currentPath === "undefined") return ROOT_DIR;

  const decodedPath = decodeURIComponent(currentPath);
  const resolvedPath = path.resolve(ROOT_DIR, decodedPath);

  if (resolvedPath === path.sep) return ROOT_DIR;

  // ensure hackers can't edit the root dir e.g /home/user to /home/user_exploit
  // we add a trailing "/" -> /home/user/ to prevent this
  const rootWithSep = ROOT_DIR.endsWith(path.sep)
    ? ROOT_DIR
    : `${ROOT_DIR}${path.sep}`;

  if (!resolvedPath.startsWith(rootWithSep) && resolvedPath !== ROOT_DIR)
    throw new Error("Path must start at root dir");

  return resolvedPath;
}

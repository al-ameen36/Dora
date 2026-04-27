import {
  copyFile,
  deleteFile,
  getFiles,
  moveFile,
  openFile,
} from "@/functions/file-ops";
import type { FileResponse, FileType } from "@/types/files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { currentPathAtom } from "../state/files";

export function useFilesAPI() {
  const queryClient = useQueryClient();
  const currentPath = useAtomValue(currentPathAtom);

  const { data } = useQuery({
    queryKey: ["ls", currentPath],
    queryFn: () => getFiles({ data: { path: currentPath } }),
  });

  const copyFiles = useMutation({
    mutationFn: copyFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls", variables.data.to] });

      const oldSnapShot = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls", variables.data.to],
      });

      queryClient.setQueriesData<FileResponse>(
        { queryKey: ["ls", variables.data.to] },
        (prev) => {
          if (!prev) return undefined;

          const newFiles = variables.data.files.map<FileType>((f) => ({
            name: f.name,
            fullPath: `${variables.data.to}/${f.name}`,
            isDirectory: f.isDirectory,
            size: -1,
          }));

          return {
            ...prev,
            files: [...prev.files, ...newFiles],
          };
        },
      );

      return { oldSnapShot };
    },
    onError: (err, _variables, context) => {
      console.error(err);

      if (context?.oldSnapShot) {
        context.oldSnapShot.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async (_data, _err, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.to],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.from],
      });
    },
  });

  const moveFiles = useMutation({
    mutationFn: moveFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls", variables.data.to] });
      await queryClient.cancelQueries({
        queryKey: ["ls", variables.data.from],
      });

      const filesSet = new Set<string>();
      const oldSnapShotTo = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls", variables.data.to],
      });

      const oldSnapShotFrom = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls", variables.data.from],
      });

      queryClient.setQueriesData<FileResponse>(
        { queryKey: ["ls", variables.data.to] },
        (prev) => {
          if (!prev) return undefined;

          const newFiles = variables.data.files.map<FileType>((f) => {
            filesSet.add(f.fullPath);
            return {
              name: f.name,
              fullPath: `${variables.data.to}/${f.name}`,
              isDirectory: f.isDirectory,
              size: -1,
            };
          });

          return {
            ...prev,
            files: [...prev.files, ...newFiles],
          };
        },
      );

      queryClient.setQueriesData<FileResponse>(
        { queryKey: ["ls", variables.data.from] },
        (prev) => {
          if (!prev) return undefined;

          const newFiles = prev.files.filter((f) => !filesSet.has(f.fullPath));

          return {
            ...prev,
            files: newFiles,
          };
        },
      );

      return { oldSnapShotTo, oldSnapShotFrom };
    },
    onError: (err, _variables, context) => {
      console.error(err);
      if (context?.oldSnapShotTo) {
        context.oldSnapShotTo.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
      if (context?.oldSnapShotFrom) {
        context.oldSnapShotFrom.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async (_data, _err, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.to],
      });
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.from],
      });
    },
  });

  const deleteFiles = useMutation({
    mutationFn: deleteFile,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.currentPath],
      });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const openFiles = useMutation({
    mutationFn: openFile,
    onError: (err) => {
      console.error(err);
    },
  });

  return {
    data,
    copyFiles,
    deleteFiles,
    moveFiles,
    openFiles,
  };
}

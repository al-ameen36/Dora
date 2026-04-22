import { copyFile, deleteFile, getFiles, moveFile } from "@/functions/file-ops";
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
    onError: (_err, _variables, context) => {
      if (context?.oldSnapShot) {
        context.oldSnapShot.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.to],
      });
    },
  });

  const moveFiles = useMutation({
    mutationFn: moveFile,
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
    onError: (_err, _variables, context) => {
      if (context?.oldSnapShot) {
        context.oldSnapShot.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.to],
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
  });

  return {
    data,
    copyFiles,
    deleteFiles,
    moveFiles,
  };
}

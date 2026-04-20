import { copyFile, deleteFile, getFiles, moveFile } from "@/functions/file-ops";
import type { FileResponse, FileType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { currentPathAtom } from "../atoms/files";

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
            isDirectory: false, // Fallback, will fix on refetch
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
    onSettled: async (variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["ls", variables.data.currentPath],
      });
    },
  });

  const moveFiles = useMutation({
    mutationFn: moveFile,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["ls"] });

      const oldSnapShot = queryClient.getQueriesData<FileResponse>({
        queryKey: ["ls"],
      });

      queryClient.setQueriesData<FileResponse>({ queryKey: ["ls"] }, (prev) => {
        if (!prev) return undefined;

        const newFiles = variables.data.files.map<FileType>((f) => ({
          name: f.name,
          fullPath: `${variables.data.to}/${f.name}`,
          isDirectory: false, // Fallback, will fix on refetch
          size: -1,
        }));

        return {
          ...prev,
          files: [...prev.files, ...newFiles],
        };
      });

      return { oldSnapShot };
    },
    onError: (_err, _variables, context) => {
      if (context?.oldSnapShot) {
        context.oldSnapShot.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ls"] });
    },
  });

  const deleteFiles = useMutation({
    mutationFn: deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ls"] });
    },
  });

  return {
    data,
    copyFiles,
    deleteFiles,
    moveFiles,
  };
}

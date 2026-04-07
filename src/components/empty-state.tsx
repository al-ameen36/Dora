import { File } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-transparent border-2">
          <File />
        </EmptyMedia>
        <EmptyTitle>Empty Folder</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

import { LucideLoader2 } from "lucide-react";

type Props = {
  name: string;
};

export default function PendingFile({ name }: Props) {
  return (
    <div className="absolute top-0 left-0 bg-black/20 w-full h-full grid place-items-center p-2">
      <LucideLoader2 className="animate-spin" />
      <p>{name}</p>
    </div>
  );
}

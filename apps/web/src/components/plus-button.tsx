import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

export function PlusButton() {
  return (
    <Button size="icon" className="size-12 fixed right-8 bottom-8 rounded-full">
      <PlusIcon className="!size-5" />
    </Button>
  );
}

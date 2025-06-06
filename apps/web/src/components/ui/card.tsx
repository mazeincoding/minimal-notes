import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useTouchPress } from "@/hooks/use-touch-press";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  const { isPressed, touchPressProps } = useTouchPress({ enabled: !!onClick });

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-4 py-2.5",
        onClick && "cursor-pointer",
        isPressed && "bg-foreground/5",
        className
      )}
      onClick={onClick}
      {...touchPressProps}
    >
      {children}
    </div>
  );
}

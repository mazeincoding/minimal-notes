"use client";
import { cn } from "@/lib/utils";
import { useScreenStore } from "@/stores/screen-store";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { CheckIcon } from "lucide-react";

export function Theme() {
  const { screen } = useScreenStore();
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      label: "Light",
      value: "light",
    },
    {
      label: "Dark", 
      value: "dark",
    },
    {
      label: "System",
      value: "system",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[4.5rem] z-10 bg-background-secondary transition-transform duration-300 ease-in-out",
        screen === "theme" ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <h1
          className={cn(
            "text-3xl font-bold transition-opacity duration-300 ease-in-out",
            screen === "theme" ? "opacity-100" : "opacity-0"
          )}
        >
          Theme
        </h1>

        <div className="flex flex-col gap-3">
          {themes.map((t) => (
            <Card
              key={t.value}
              className={cn(
                "flex items-center justify-between",
                theme === t.value && "text-primary"
              )}
              onClick={() => setTheme(t.value)}
            >
              <h3 className="text-base font-medium">{t.label}</h3>
              {theme === t.value && (
                <CheckIcon className="size-4 text-primary" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

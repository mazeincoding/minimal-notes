"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useScreenStore } from "@/stores/screen-store";
import { ChevronRightIcon, FileTextIcon, PaletteIcon, UserIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function Home() {
  const { screen, setScreen } = useScreenStore();
  const { data: session } = useSession();

  const items = [
    {
      icon: FileTextIcon,
      title: "Notes",
      color: "bg-yellow-500",
      onClick: () => {
        setScreen("notes");
      },
    },
    {
      icon: UserIcon,
      title: session ? "Account" : "Sign in",
      color: "bg-rose-500",
      onClick: () => {
        setScreen(session ? "account" : "signin");
      },
    },
    {
      icon: PaletteIcon,
      title: "Theme",
      color: "bg-blue-500",
      onClick: () => {
        setScreen("theme");
      },
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[2rem] z-10 bg-background-secondary"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <h1
          className={cn(
            "text-3xl font-bold transition-opacity duration-300 ease-in-out",
            screen === "home" ? "opacity-100" : "opacity-0"
          )}
        >
          Home
        </h1>
        <section className="flex flex-col gap-3 overflow-y-auto h-full">
          {items.map((item) => (
            <Card
              key={item.title}
              className="flex gap-3 items-center justify-between"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "size-7 rounded-md flex items-center justify-center",
                    item.color
                  )}
                >
                  <item.icon
                    strokeWidth={2}
                    className="size-4 text-white flex-shrink-0"
                  />
                </div>
                <h3 className="text-base font-medium">{item.title}</h3>
              </div>
              <ChevronRightIcon
                className="size-4 text-muted-foreground flex-shrink-0"
                strokeWidth={2}
              />
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

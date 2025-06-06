"use client";
import { cn } from "@/lib/utils";
import { useScreenStore } from "@/stores/screen-store";
import { Card } from "@/components/ui/card";
import { LogOutIcon, PencilIcon, UserIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";
import { createAlert } from "@/stores/alert-store";

export function Account() {
  const { screen } = useScreenStore();
  const { data: session } = useSession();

  const settings = [
    {
      label: "Change name",
      href: "/settings",
      icon: <PencilIcon className="size-4 flex-shrink-0" />,
      onClick: () => {
        createAlert({
          title: "Change Name",
          message: "Enter your new name",
          textField: {
            placeholder: "Enter your name",
            defaultValue: session?.user?.name || "",
            type: "text",
          },
          buttons: [
            {
              text: "Cancel",
            },
            {
              text: "Save",
              primary: true,
              action: (newName) => {
                if (newName && newName.trim()) {
                  updateName(newName.trim());
                } else {
                  console.log("Name cannot be empty");
                }
              },
            },
          ],
        });
      },
    },
    {
      label: "Log out",
      href: "/account",
      color: "text-destructive",
      icon: <LogOutIcon className="size-4 flex-shrink-0" />,
      onClick: () => {
        authClient.signOut();
      },
    },
  ];

  async function updateName(newName: string) {
    const { data, error } = await authClient.updateUser({ name: newName });

    if (error) {
      createAlert({
        title: "Error updating name",
        message: error.message || "Something went wrong",
        buttons: [
          {
            text: "OK",
            primary: true,
          },
        ],
      });
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[4.8rem] z-10 bg-background-secondary transition-transform duration-300 ease-in-out",
        screen === "account" ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <h1
          className={cn(
            "text-3xl font-bold transition-opacity duration-300 ease-in-out",
            screen === "account" ? "opacity-100" : "opacity-0"
          )}
        >
          Account
        </h1>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-medium">
              {session?.user?.name || "Anonymous"}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {settings.map((setting) => (
              <Card
                key={setting.label}
                className="flex gap-3 items-center justify-between"
                onClick={setting.onClick}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 w-full",
                    setting.color
                  )}
                >
                  {setting.icon}
                  <h3 className="text-base font-medium">{setting.label}</h3>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

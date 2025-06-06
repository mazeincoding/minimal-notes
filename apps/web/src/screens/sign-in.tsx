"use client";
import { cn } from "@/lib/utils";
import { useScreenStore } from "@/stores/screen-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { createAlert } from "@/stores/alert-store";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export function SignIn() {
  const { screen } = useScreenStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isSigningIn = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const name = values.email.split("@")[0];

      const { data, error } = await authClient.signIn.magicLink({
        name,
        email: values.email,
        callbackURL: "/",
      });

      if (error) {
        console.error(error);
        createAlert({
          title: "Error sending email",
          message: error.message || "Something went wrong",
          buttons: [
            {
              text: "OK",
              primary: true,
            },
          ],
        });
      }

      if (data) {
        createAlert({
          title: "Magic link sent",
          message: "Check your email for a magic link to sign in",
          buttons: [
            {
              text: "OK",
              primary: true,
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 h-full px-6 fixed inset-0 pt-[4.8rem] z-10 bg-background-secondary transition-transform duration-300 ease-in-out",
        screen === "signin" ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex flex-col gap-4 h-full">
        <h1
          className={cn(
            "text-3xl font-bold transition-opacity duration-300 ease-in-out",
            screen === "signin" ? "opacity-100" : "opacity-0"
          )}
        >
          Sign in
        </h1>

        <section className="flex flex-col gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
}

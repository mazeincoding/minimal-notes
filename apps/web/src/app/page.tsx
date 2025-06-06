import { Header } from "@/components/header";
import { Home } from "@/screens/home";
import { Notes } from "@/screens/notes";
import { Editor } from "@/screens/editor";
import { Account } from "@/screens/account";
import { SignIn } from "@/screens/sign-in";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-2 pt-3 bg-background-secondary h-dvh">
      <Header />
      <Home />
      <Notes />
      <Editor />
      <Account />
      <SignIn />
    </main>
  );
}

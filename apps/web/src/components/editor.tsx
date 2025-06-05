"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Editor() {
  const [text, setText] = useState("This is some piece of text.");

  return (
    <div className="flex flex-col gap-2 h-[calc(100vh-64px)]">
      <TitleInput />
      <div className="flex-1">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="!text-base text-foreground/85 bg-transparent border-none outline-none resize-none !ring-0 p-0 h-full"
          placeholder="Start writing..."
          rows={3}
        />
      </div>
    </div>
  );
}

function TitleInput() {
  const [title, setTitle] = useState("Hello world");
  return (
    <Input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="!text-2xl font-bold bg-transparent border-none outline-none !ring-0 p-0"
      placeholder="Title..."
    />
  );
}

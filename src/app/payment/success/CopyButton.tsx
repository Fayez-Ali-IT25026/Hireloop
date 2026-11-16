"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard access can be blocked by the browser — nothing to do here.
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={copy}
      className="h-8 shrink-0 gap-1.5 rounded-lg px-2 text-[11px] text-zinc-300 hover:bg-white/10 hover:text-white"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-400" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export default CopyButton;

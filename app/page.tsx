"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Copy, Check } from "lucide-react";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const shortenUrl = process.env.NEXT_PUBLIC_SHORTEN_URL || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const schema = z.object({
  url: z
    .string()
    .trim()
    .nonempty("URL is required")
    .url("URL is not valid"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const url = watch("url");

  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setShortUrl(null);
    setErrorMsg(null);
    setCopied(false);

    const { data: shortCode, error } = await supabase.rpc("generate_short_url", {
      p_long_url: data.url,
      p_code_length: 6,
    });

    if (error) {
      console.error("Error creating link:", error.message);
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    const newShortUrl = `${shortenUrl}${shortCode}`;
    setShortUrl(newShortUrl);
    setIsLoading(false);
  };

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black relative">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-2">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black gap-4 rounded-2xl">
          <div className="w-full flex flex-col items-start gap-2 ">
            <Input placeholder="Enter your long URL" showClear={!!url} {...register("url")} onClear={() => setValue("url", "")} />
            {errors.url && <p className="w-full text-left text-sm text-red-500 " >{errors.url.message}</p>}
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>

          {shortUrl && (
            <div className="mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100 truncate">
                {shortUrl}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          )}
        </main>
      </form>

      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Generation Failed</h3>
            <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">{errorMsg}</p>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setErrorMsg(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

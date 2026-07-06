"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col items-center gap-2">
        <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black gap-4">
          <div className="w-full flex flex-col items-start gap-2 ">
            <Input placeholder="Enter your long URL" showClear={!!url} {...register("url")} onClear={() => setValue("url", "")} />
            {errors.url && <p className="w-full text-left text-sm text-red-500 " >{errors.url.message}</p>}
          </div>

          <Button
            type="submit"
            variant="outline">
            Generate
          </Button>
        </main>
      </form>
    </div>
  );
}

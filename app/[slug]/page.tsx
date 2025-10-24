import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerClientStrict as createServer } from "@/lib/supabase/server";

type PageProps = { params: { slug: string } };

export default async function Page({ params }: PageProps) {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !data) notFound();

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">{data.name ?? data.slug}</h1>
      {data.avatar_url ? (
        <Image
          src={data.avatar_url}
          alt={data.name ?? "avatar"}
          width={160}
          height={160}
        />
      ) : null}
      {data.role ? <p>{data.role}</p> : null}
      {data.email ? <p>{data.email}</p> : null}
    </main>
  );
}

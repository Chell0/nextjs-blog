import Image from "next/image";
import { fullBlog } from "@/app/lib/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { PortableText } from "next-sanity";

export const revalidate = 30; // revalidate at most every 30 seconds

async function getData(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
        title,
        content,
        titleImage
    }[0]`;
  const data = await client.fetch(query);
  return data;
}

export default async function BlogArticle({
  params,
}: {
  params: { slug: string };
}) {
  const data: fullBlog = await getData(params.slug);

  return (
    <>
      <div className={`mt-8`}>
        <h1>
          <span
            className={`block text-base text-center text-primary font-semibold tracking-wide uppercase`}
          >
            Gabriel Machel - Blog
          </span>
          <span
            className={`mt-2 block text-3xl text-center leading-8 font-bold tracking-light sm:text-4xl`}
          >
            {data.title}
          </span>
        </h1>
        {/* Blog Post Image */}
        <Image
          src={urlFor(data.titleImage).url()}
          width={800}
          height={800}
          alt="Title Image"
          priority
          className="rounded-lg mt-8 border"
        />
        {/* Blog Post Content */}
        <div className={`mt-16 prose prose-blue prose-lg dark:prose-invert`}>
          <PortableText value={data.content} />
        </div>
      </div>
    </>
  );
}


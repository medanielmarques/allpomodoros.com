import { HoverEffect } from "@/components/ui/card-hover-effect";
import Link from "next/link";

export const getServerSideProps = async () => {
  const notionToken = process.env.NOTION_TOKEN;
  const notionVersion = "2022-06-28";

  const apps = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + notionToken,
        "Notion-Version": notionVersion,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [
          {
            property: "name",
            direction: "ascending",
          },
        ],
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(async (data) => {
      return data.results.map((app) => ({
        name: app.properties.name.title[0].text.content as string,
        link: app.properties.link.rich_text[0].plain_text as string,
        description: app.properties.description.rich_text[0]
          .plain_text as string,
      })) as PomodoroApp[];
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });

  return { props: { apps } };
};

export default function Home({ apps = [] }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-black p-4 text-white bg-dot-white/[0.2]">
      <div className="max-w-5xl">
        <div className="mt-4">
          <p>Pomodoro Plaza</p>
        </div>

        <div className="mx-auto w-1/2">
          <p className="bg-gradient-to-b from-neutral-400 to-neutral-500 bg-clip-text py-8 text-center text-4xl font-bold sm:text-5xl">
            All Best Pomodoro Timer Apps
          </p>
        </div>

        <HoverEffect items={apps} />

        <footer className="text-center">
          <Link href="https://x.com/medanielmarques" target="_blank">
            <button className="rounded-lg bg-indigo-700 p-4 hover:bg-indigo-600">
              Made by → @medanielmarques
            </button>
          </Link>
        </footer>
      </div>
    </main>
  );
}

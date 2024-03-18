import { Button } from "@/components/ui/button"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useState } from "react"

type PomodoroApp = {
  name: string
  link: string
  description: string
}

export const getServerSideProps = async () => {
  const notionToken = process.env.NOTION_TOKEN
  const notionVersion = "2022-06-28"

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
    },
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then(async (data) => {
      return data.results
        .filter((app) => {
          const name = app.properties?.name?.title[0]?.text?.content
          const link = app.properties?.link?.rich_text[0]?.plain_text
          const description =
            app.properties?.description?.rich_text[0]?.plain_text

          return (
            name !== "" &&
            link !== "" &&
            description !== "" &&
            name !== undefined &&
            link !== undefined &&
            description !== undefined
          )
        })
        .map((app) => ({
          name: app.properties.name.title[0].text.content as string,
          link: app.properties.link.rich_text[0].plain_text as string,
          description: app.properties.description.rich_text[0]
            .plain_text as string,
        })) as PomodoroApp[]
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error)
    })

  return { props: { apps } }
}

export default function Home({ apps = [] }) {
  const [email, setEmail] = useState("")
  const [twitter, setTwitter] = useState("")
  const [link, setLink] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVisualFeedback, setShowVisualFeedback] = useState(false)

  async function handleSubmitApp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    await fetch("/api/submit-app", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    }).then((res) => {
      if (res.ok) {
        setIsSubmitting(false)
        setShowVisualFeedback(true)
        setTimeout(() => {
          setShowVisualFeedback(false)
          setEmail("")
          setTwitter("")
          setLink("")
        }, 3000)
      }
    })
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center gap-12 bg-black text-white bg-dot-white/[0.2]">
      <div className="max-w-5xl p-4">
        <div className="mt-4">
          <p>All Pomodoros</p>
        </div>

        <div className="mx-auto w-1/2">
          <p className="bg-gradient-to-b from-neutral-400 to-neutral-500 bg-clip-text py-8 text-center text-4xl font-bold sm:text-5xl">
            All Best Pomodoro Timer Apps
          </p>
        </div>

        <HoverEffect items={apps} />

        <footer className="text-center">
          <Link href="https://x.com/medanielmarques" target="_blank">
            <button className="rounded-lg bg-indigo-700 px-4 py-3 hover:bg-indigo-600">
              Made by → @medanielmarques
            </button>
          </Link>
        </footer>
      </div>

      <div className="flex w-full justify-center bg-neutral-950 p-12">
        <div className="max-w-1/3 flex flex-col gap-6">
          <div className="m-auto flex w-3/4 flex-col justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Submit your Pomodoro app
            </h2>
            <p>Get more visibility for your Pomodoro Timer App.</p>
          </div>

          <form onSubmit={handleSubmitApp}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full flex-col gap-4 md:flex-row">
                <div className="items-center gap-3">
                  <Label htmlFor="email">
                    <span className="text-red-600">*</span> Your email
                  </Label>
                  <Input
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="john@doe.io"
                    required
                  />
                </div>

                <div className="items-center gap-1.5">
                  <Label htmlFor="twitter">Your twitter</Label>
                  <Input
                    onChange={(event) => setTwitter(event.target.value)}
                    value={twitter}
                    type="text"
                    id="twitter"
                    name="twitter"
                    placeholder="@johndoe"
                  />
                </div>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="project-url">
                  <span className="text-red-600">*</span> Project URL
                </Label>
                <Input
                  onChange={(event) => setLink(event.target.value)}
                  value={link}
                  type="url"
                  id="project-url"
                  name="link"
                  placeholder="Enter the public url of your project"
                  required
                />
              </div>

              {showVisualFeedback ? (
                <Button
                  type="button"
                  className="mt-3 flex w-full cursor-default items-center gap-2 rounded-lg bg-green-700 px-4 py-6 hover:bg-green-700 md:mt-6 md:w-auto"
                >
                  Submitted! 🎉
                </Button>
              ) : (
                <Button
                  disabled={isSubmitting}
                  className="mt-3 flex w-full items-center gap-2 rounded-lg bg-indigo-700 px-4 py-6 hover:bg-indigo-600 md:mt-6 md:w-auto"
                >
                  {isSubmitting && <ReloadIcon className="animate-spin" />}
                  {isSubmitting ? "Submitting" : "Submit your project →"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

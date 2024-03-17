import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = JSON.parse(req.body)
  let status: number

  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.NOTION_TOKEN,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DATABASE_ID_REQUESTS },
      properties: {
        email: { title: [{ text: { content: data.email } }] },
        link: { rich_text: [{ text: { content: data.link } }] },
        twitter: { rich_text: [{ text: { content: data.twitter } }] },
      },
    }),
  })
    .then((response) => {
      status = response.status
      console.log("Success:", response)
    })
    .catch((error) => {
      status = 500
      console.error("Error:", error)
    })

  res.status(status!).json({})
}

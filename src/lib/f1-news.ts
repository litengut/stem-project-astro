import { readFile } from "node:fs/promises"
import path from "node:path"

type F1NewsItem = {
  title: string
  summary: string
  link: string
  image: string
}

export async function getF1LatestNews(limit = 8): Promise<F1NewsItem[]> {
  const filePath = path.join(process.cwd(), "public", "f1", "news.json")

  try {
    const raw = await readFile(filePath, "utf-8")
    const parsed = JSON.parse(raw) as F1NewsItem[]
    return parsed.slice(0, limit)
  } catch {
    return []
  }
}

export type { F1NewsItem }

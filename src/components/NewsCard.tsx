// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { F1NewsItem } from "@/lib/f1-news"

export function NewsCard({ news }: { news: F1NewsItem }) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={news.image}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader className="h-30">
        {/* <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction> */}
        <CardTitle>{news.title}</CardTitle>
        <CardDescription>{news.summary}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Read on F1 website</Button>
      </CardFooter>
    </Card>
  )
}

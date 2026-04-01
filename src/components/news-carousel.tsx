import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { F1NewsItem } from "@/lib/f1-news"
import { NewsCard } from "./Newscard"

type Props = {
  items: F1NewsItem[]
}

export function NewsCarousel({ items }: Props) {
  return (
    <Carousel
      className="w-full max-w-[76rem] px-10"
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.link}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1.5">
              <NewsCard news={item}></NewsCard>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  )
}

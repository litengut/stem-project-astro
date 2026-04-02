"use client"

import { NavigationBar } from "./navigation/Navigationbar"

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <a href="/" className="group flex items-center gap-3">
          <div className="">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#e10600] uppercase">
              Formula 1
            </p>
            <p className="text-sm font-semibold tracking-wide">bla bla bla</p>
          </div>
        </a>
        <NavigationBar />
      </div>
    </header>
  )
}

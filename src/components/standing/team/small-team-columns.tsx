"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TeamStandingRow } from "../types"
import { makeLinkFromName } from "@/components/navigation/nav-data"
// import { Form } from "../Formstatus"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const smallTeamColumns: ColumnDef<TeamStandingRow>[] = [
  {
    accessorKey: "position",
    meta: {
      className: "w-2",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "teamLogo",
    header: "",
    meta: {
      className: "w-10",
    },
    cell: ({ row }) => {
      const team = row.original
      return (
        <img
          src={team.teamLogo}
          alt={`${team.team} logo`}
          className="ml-auto h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      )
    },
  },
  {
    accessorKey: "team",
    header: "Team Name",
    meta: {
      className: "w-[5rem]",
    },
    cell: ({ row }) => {
      const link = makeLinkFromName(row.original.team, "team")
      return <a href={link}>{row.original.team}</a>
    },
  },
  {
    accessorKey: "wins",
    header: "Wins",
    meta: {
      className: "w-10 text-right",
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.wins}</div>
    },
  },
  {
    accessorKey: "podiums",
    header: "Podiums",
    meta: {
      className: "w-10 text-right",
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.podiums}</div>
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    meta: {
      className: "w-10 text-right",
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.points}</div>
    },
  },
  // {
  //   accessorKey: "FormStatus",
  //   header: "Performance",
  //   meta: {
  //     className: "w-10",
  //   },
  //   cell: ({ row }) => {
  //     const form = row.original.form
  //     return (
  //       <div className="flex">
  //         <Form form={form} />
  //       </div>
  //     )
  //   },
  // },
]

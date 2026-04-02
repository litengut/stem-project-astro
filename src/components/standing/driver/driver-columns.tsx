"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "../Formstatus"
import type { DriverStandingRow } from "../types"
import { makeLinkFromName } from "@/components/navigation/nav-data"

export const driverColumns: ColumnDef<DriverStandingRow>[] = [
  {
    accessorKey: "position",
    meta: {
      className: "w-24",
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
    accessorKey: "image",
    header: "",
    meta: {
      className: "w-20",
    },
    cell: ({ row }) => {
      const driver = row.original
      return (
        <img
          src={driver.image}
          alt={`${driver.team} logo`}
          className="ml-auto h-8 w-8 rounded-full object-cover object-top"
          loading="lazy"
        />
      )
    },
  },
  {
    accessorKey: "driver",
    header: "Driver",
    meta: {
      className: "w-[10rem] ",
    },

    cell: ({ row }) => {
      const link = makeLinkFromName(row.original.driver, "driver")
      return <a href={link}>{row.original.driver}</a>
    },
  },
  {
    accessorKey: "teamLogo",
    header: "",
    meta: {
      className: "w-20",
    },
    cell: ({ row }) => {
      const driver = row.original
      return (
        <img
          src={driver.teamLogo}
          alt={`${driver.team} logo`}
          className="ml-auto h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      )
    },
  },
  {
    accessorKey: "team",
    header: "Team",
    meta: {
      className: "w-[14rem]",
    },
  },
  {
    accessorKey: "number",
    header: "No.",
    meta: {
      className: "w-20 text-right",
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.number}</div>
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    meta: {
      className: "w-24 text-right",
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.points}</div>
    },
  },
  {
    accessorKey: "formStatus",
    header: "Status",
    meta: {
      className: "w-40",
    },
    cell: ({ row }) => {
      const form = row.original.form
      return <Form form={form} />
    },
  },
]

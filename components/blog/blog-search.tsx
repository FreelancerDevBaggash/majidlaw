"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function BlogSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-bold font-arabic mb-4">البحث في المقالات</h3>
      <form onSubmit={handleSearch} className="space-y-4">
        <Input
          type="text"
          placeholder="ابحث عن مقال..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-arabic"
        />
        <Button type="submit" className="w-full font-arabic">
          <Search className="w-4 h-4 ml-2" />
          بحث
        </Button>
      </form>
    </div>
  )
}

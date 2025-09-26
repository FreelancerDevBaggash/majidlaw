"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FloatingLabelInputProps {
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function FloatingLabelInput({ label, type = "text", value, onChange, className }: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn("pt-6 pb-2", className)}
        placeholder=" "
      />
      <label
        className={cn(
          "floating-label absolute right-3 top-3 text-muted-foreground pointer-events-none transition-all duration-300",
          (isFocused || value) && "active",
        )}
      >
        {label}
      </label>
    </div>
  )
}

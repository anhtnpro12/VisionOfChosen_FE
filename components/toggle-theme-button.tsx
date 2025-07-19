"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ToggleThemeButton() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}
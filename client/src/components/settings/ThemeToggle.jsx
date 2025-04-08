import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if localStorage has a theme preference
    const storedTheme = localStorage.getItem("theme")

    if (storedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    } else if (storedTheme === "light") {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    } else {
      // If no stored preference, check system preference
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(systemPrefersDark)

      if (systemPrefersDark) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const toggleTheme = (checked) => {
    setIsDarkMode(checked)

    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      toast.info('Dark mode enabled',{
        description: "The application is now in dark mode.",
      })
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      toast.info('Light mode enabled',{
        description: "The application is now in light mode.",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="theme-toggle" className="text-base">
            Dark Mode
          </Label>
          <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Sun className="h-5 w-5 text-muted-foreground" />
          <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={toggleTheme} />
          <Moon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -5 }}
          className={`border rounded-lg p-4 flex items-center justify-center cursor-pointer ${
            !isDarkMode ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => toggleTheme(false)}
        >
          <div className="text-center">
            <Sun className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">Light Mode</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className={`border rounded-lg p-4 flex items-center justify-center cursor-pointer ${
            isDarkMode ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => toggleTheme(true)}
        >
          <div className="text-center">
            <Moon className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
            <p className="font-medium">Dark Mode</p>
          </div>
        </motion.div>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        <p>Your theme preference will be saved and applied across sessions.</p>
      </div>
    </motion.div>
  )
}


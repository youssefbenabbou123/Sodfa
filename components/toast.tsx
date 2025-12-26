"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        ) : (
          <X className="w-5 h-5 text-red-600 dark:text-red-400" />
        )}
        <p
          className={`text-sm font-medium ${
            type === "success"
              ? "text-green-800 dark:text-green-200"
              : "text-red-800 dark:text-red-200"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}



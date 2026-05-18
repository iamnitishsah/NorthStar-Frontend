import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import { Toaster } from "sonner"
import { QueryProvider } from "./app/providers/query-provider"
import { ThemeProvider } from "./app/providers/theme-provider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
)

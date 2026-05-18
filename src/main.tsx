import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import { Toaster } from "sonner"
import { QueryProvider } from "./app/providers/query-provider"

const savedTheme = localStorage.getItem("northstar-theme")

if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </QueryProvider>
  </React.StrictMode>
)

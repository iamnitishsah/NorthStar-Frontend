import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Props = HTMLAttributes<HTMLDivElement>

function Card({
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "dashboard-surface theme-transition rounded-xl hover:shadow-enterprise-md",
        className
      )}
      {...props}
    />
  )
}

export default Card

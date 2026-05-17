import type { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

function Card({
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  )
}

export default Card

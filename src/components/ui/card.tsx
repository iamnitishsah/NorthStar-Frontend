import type { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

function Card({
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:shadow-md hover:shadow-slate-900/10 ${className}`}
      {...props}
    />
  )
}

export default Card

import type { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

function Card({
  className = "",
  ...props
}: Props) {
  return (
    <div
      className={`dashboard-surface theme-transition rounded-lg hover:shadow-enterprise-md ${className}`}
      {...props}
    />
  )
}

export default Card

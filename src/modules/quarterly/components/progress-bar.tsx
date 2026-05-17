import {
  clampProgress,
  getProgressBarClassName,
} from "../utils/quarterly"
import { memo } from "react"

type Props = {
  value?: number | null
}

function ProgressBar({ value }: Props) {
  const width = clampProgress(value)

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${getProgressBarClassName(value)}`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export default memo(ProgressBar)

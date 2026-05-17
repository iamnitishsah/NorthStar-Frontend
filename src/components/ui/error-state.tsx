import { AlertCircle } from "lucide-react"

import Button from "./button"

type Props = {
  title?: string
  message: string
  onRetry?: () => void
}

function ErrorState({
  title = "Unable to load",
  message,
  onRetry,
}: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 shrink-0" size={20} />
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm">{message}</p>
          {onRetry && (
            <Button
              className="mt-4"
              onClick={onRetry}
              variant="secondary"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorState

import { toast } from "sonner"

import { getApiErrorMessage } from "./api-error"

export function toastSuccess(message: string) {
  toast.success(message)
}

export function toastApiError(error: unknown, fallback: string) {
  toast.error(getApiErrorMessage(error, fallback))
}

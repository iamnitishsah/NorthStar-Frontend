import axios from "axios"

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
) {
  if (!axios.isAxiosError(error)) return fallback

  const detail = error.response?.data?.detail

  if (typeof detail === "string") return detail

  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item?.msg === "string" ? item.msg : null
      )
      .filter((message): message is string => Boolean(message))
      .join(", ") || fallback
  }

  if (detail && typeof detail === "object") {
    const message = (detail as { message?: unknown }).message

    if (typeof message === "string") return message
  }

  return fallback
}

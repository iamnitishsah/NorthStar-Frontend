import Button from "./button"

type Props = {
  title: string
  description: string
  confirmLabel?: string
  isPending?: boolean
  onCancel: () => void
  onConfirm: () => void
}

function ConfirmationDialog({
  title,
  description,
  confirmLabel = "Confirm",
  isPending = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-950">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={onConfirm}
            variant="danger"
          >
            {isPending ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

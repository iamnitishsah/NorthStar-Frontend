import Button from "./button"
import { ModalFooter, ModalShell } from "./surface"

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
    <ModalShell
      title={title}
      description={description}
      maxWidth="md"
      onClose={onCancel}
      footer={
        <ModalFooter>
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
        </ModalFooter>
      }
    >
      <span className="sr-only">{description}</span>
    </ModalShell>
  )
}

export default ConfirmationDialog

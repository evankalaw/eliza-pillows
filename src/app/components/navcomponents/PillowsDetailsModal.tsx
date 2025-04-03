import ReusableModal from "../modal/ReusableModal";

interface PillowDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PillowDetailsModal({
  open,
  onClose,
}: PillowDetailsModalProps) {
  return (
    <ReusableModal open={open} onClose={onClose} borderClassName="p-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Pillow Details</h1>
        <p className="text-sm">
          This is the pillow details modal. It is used to display the details of
          the pillow.
        </p>
      </div>
    </ReusableModal>
  );
}

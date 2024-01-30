import SubmitButton from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/button";
import useDialog from "@/utils/dialogStore";

interface ConfirmDeleteFormProps {
  handleDelete: () => Promise<void>;
}

export const ConfirmDeleteForm = ({ handleDelete }: ConfirmDeleteFormProps) => {
  const { closeDialog } = useDialog();

  return (
    <form action={handleDelete}>
      <p className="py-3 text-sm text-zinc-300">Are you sure?</p>
      <div className="flex justify-end">
        <Button variant="secondary" type="button" onClick={closeDialog}>
          Cancel
        </Button>
        <SubmitButton variant="destructive" className="ml-3">
          Delete
        </SubmitButton>
      </div>
    </form>
  );
};

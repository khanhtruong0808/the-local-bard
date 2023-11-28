import Button from "./ui/Button";
import SubmitButton from "./ui/SubmitButton";

interface ConfirmDeleteFormProps {
  handleDelete: () => Promise<void>;
}

export const ConfirmDeleteForm = ({ handleDelete }: ConfirmDeleteFormProps) => {
  return (
    <form action={handleDelete}>
      <p className="py-3 text-sm text-zinc-300">Are you sure?</p>
      <div className="flex justify-end">
        <Button variant="secondary">Cancel</Button>
        <SubmitButton variant="alert" className="ml-3">
          Delete
        </SubmitButton>
      </div>
    </form>
  );
};

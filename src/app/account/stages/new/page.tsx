import { CreateStageForm } from "@/components/forms/CreateStageForm";

export default async function EditStagePage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
      <CreateStageForm />
    </div>
  );
}

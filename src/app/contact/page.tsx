import { ContactForm } from "@/components/forms/ContactForm";

export default async function ContactPage() {
  return (
    <div className="mb-40 px-4 sm:px-6 md:mb-0 lg:flex-auto">
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20">
        <ContactForm />
      </div>
    </div>
  );
}

"use client";

import { AlertCircle, Check } from "lucide-react";
import { useActionState } from "react";

import { sendContactEmail } from "@/actions/sendContactEmail";
import SubmitButton from "@/components/ui/SubmitButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormServerState } from "@/lib/types";

export function ContactForm() {
  const [state, formAction] = useActionState<FormServerState, FormData>(
    sendContactEmail,
    { status: "idle" },
  );

  return (
    <form action={formAction}>
      <h2 className="mb-12 text-center text-3xl font-semibold text-zinc-200">
        Contact Us
      </h2>
      <div className="space-y-4">
        {state.status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.status === "success" && (
          <Alert variant="success">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Email sent.</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="name">Name</Label>
          <div className="mt-2">
            <Input
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Name"
              required
              maxLength={100}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-2">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              aria-label="Email"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="mt-2">
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              aria-label="Phone Number"
              maxLength={16}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <div className="mt-2">
            <Textarea
              name="message"
              placeholder="Message"
              aria-label="Message"
              maxLength={1000}
              required
            />
          </div>
        </div>
        <SubmitButton>Send</SubmitButton>
      </div>
    </form>
  );
}

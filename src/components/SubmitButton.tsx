"use client";
/**
 * This is a client-side only wrapper around the Button component so that it
 * can use the useFormStatus hook to disable the button while the form is
 * submitting.
 */

import type { ButtonProps } from "./Button";
import Button from "./Button";
import { useFormStatus } from "react-dom";

export default function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} {...props} />;
}

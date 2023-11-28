"use client";
/**
 * This is a client-side only wrapper around the Button component so that it
 * can use the useFormStatus hook to disable the button while the form is
 * submitting.
 */

import { useFormStatus } from "react-dom";

import Button, { type ButtonProps } from "./Button";

export default function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return <Button disabled={pending} {...props} />;
}

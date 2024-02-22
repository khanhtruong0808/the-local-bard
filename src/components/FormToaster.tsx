"use client";

import { FormServerState } from "@/lib/types";
import { useEffect, useId, useMemo } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

const style = { minWidth: "200px" };

export default function FormToaster({
  state,
  msgs,
}: {
  state: FormServerState;
  msgs?: { loading?: string; success?: string; failure?: string };
}) {
  const { pending } = useFormStatus();
  const id = useId();

  const options = useMemo(() => ({ id, style }), [id]);

  useEffect(() => {
    // Create a delay to prevent flickering of the loading state
    let timeoutId: NodeJS.Timeout | null = null;

    if (state.status === "success") {
      toast.success(msgs?.success || "Success", options);
    } else if (state.status === "error") {
      // Custom error message OR form state error OR generic error message
      toast.error(msgs?.failure || state.error || "Failure", options);
    } else if (pending) {
      timeoutId = setTimeout(() => {
        toast.loading(msgs?.loading || "Submitting form...", options);
      }, 1);
    } else {
      toast.dismiss(id);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [id, msgs, options, pending, state]);

  return null;
}

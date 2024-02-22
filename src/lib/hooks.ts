import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  type FieldValues,
  type Path,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReset,
} from "react-hook-form";

import { deepEqual } from "./utils";

/**
 * Combine RHF's useForm hook with server actions and local storage.
 */
export function useFormCustom<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props: UseFormProps<TFieldValues, TContext> & { localStorageKey: string }) {
  const [isLocalStorageApplied, setIsLocalStorageApplied] = useState(false);

  const defaultValues = useMemo(
    () => props.defaultValues || {},
    [props.defaultValues],
  );

  const localStorageValues = useMemo(() => {
    if (typeof window !== "undefined") {
      const localStorageValStr = window.localStorage.getItem(
        props.localStorageKey,
      );
      if (localStorageValStr) {
        return { ...defaultValues, ...JSON.parse(localStorageValStr) };
      }
    }
    return defaultValues;
  }, [defaultValues, props.localStorageKey]);

  const form = useForm<TFieldValues, TContext, TTransformedValues>({
    ...props,
    defaultValues: props.defaultValues,
  });

  const isDifferent = Object.entries(defaultValues).some(
    ([key, value]) => !deepEqual(localStorageValues[key], value),
  );

  // Once on mount, apply local storage values if different from default values
  useEffect(() => {
    // We haven't applied local storage values yet, but they are different from
    // the default values. Apply them to the form now.
    if (!isLocalStorageApplied && isDifferent) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        // Exception just for poster image. Maybe a better way to do this...
        if (key === "poster") return;

        if (!deepEqual(localStorageValues[key], value)) {
          form.setValue(key as Path<TFieldValues>, localStorageValues[key]);
        }
      });
      setIsLocalStorageApplied(true);
    }
  }, [
    defaultValues,
    form,
    isDifferent,
    isLocalStorageApplied,
    localStorageValues,
  ]);

  // Watch for changes to the form and save to local storage on change
  useEffect(() => {
    const watch = form.watch((values) => {
      if (deepEqual(values, localStorageValues)) {
        return;
      }

      if (deepEqual(values, defaultValues)) {
        window.localStorage.removeItem(props.localStorageKey);
        setIsLocalStorageApplied(false);
        return;
      }

      if (Object.entries(values).length) {
        window.localStorage.setItem(
          props.localStorageKey,
          JSON.stringify(values),
        );
      }
    });

    return () => {
      watch.unsubscribe();
    };
  }, [props.localStorageKey, form, defaultValues, localStorageValues]);

  // Combine RHF's isDirty state with our own isLocalStorageApplied state which checks
  // if we applied different values from localStorage than the default values
  const isDirty = form.formState.isDirty || isLocalStorageApplied;

  /**
   * Extend RHF's reset function to also remove the localStorage item
   */
  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions) => {
    window.localStorage.removeItem(props.localStorageKey);
    setIsLocalStorageApplied(false);
    form.reset(values, keepStateOptions);
  };

  const handleAction = async (onAction: SubmitHandler<TFieldValues>) => {
    const valid = await form.trigger();
    if (valid) {
      window.localStorage.removeItem(props.localStorageKey);
      setIsLocalStorageApplied(false);

      const formValues = form.getValues();
      const result = onAction(formValues);
      form.reset(formValues);
      return result;
    }
    console.error(form.formState.errors);
  };

  return {
    ...form,
    handleAction,
    isDirty,
    reset,
  };
}

/**
 * Custom hook to provide to Select components to force a re-render when the key changes.
 * For some reason, shadcn's select does not update when you do form.setValue,
 * so we need to call updateKey to actually get the select to re-render.
 */
export function useSelectKey() {
  let key = new Date().getTime();

  const updateKey = () => {
    key = new Date().getTime();
  };

  return {
    key,
    updateKey,
  };
}

import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form";

import { deepEqual } from "./utils";

/**
 * Extend RHF's useForm hook to support automatic local storage save/apply.
 * Note the custom `isFormDirty` which combines RHF's isDirty state with a
 * check to see if the localStorage values we applied were different than the
 * defaultValues provided.
 * Also, make sure to call `form.cleanup()` after you successfully submitted.
 */
export function useFormWithLocalStorage<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props: UseFormProps<TFieldValues, TContext> & { localStorageKey: string }) {
  const [isLocalStorageApplied, setIsLocalStorageApplied] = useState(false);

  const defaultValues = useMemo(
    () => props.defaultValues || {},
    [props.defaultValues],
  );

  const initialValues = useMemo(() => {
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
    defaultValues: initialValues,
  });

  useEffect(() => {
    // Check if the initialValues are different from defaultValues
    // and update the dirty state accordingly
    const isDifferent = Object.entries(defaultValues).some(
      ([key, value]) => !deepEqual(initialValues[key], value),
    );
    if (isDifferent) {
      setIsLocalStorageApplied(true);
    }
  }, [defaultValues, initialValues, form]);

  // Watch for changes to the form and save to local storage on change
  const watch = form.watch();
  useEffect(() => {
    if (Object.entries(watch).length) {
      window.localStorage.setItem(props.localStorageKey, JSON.stringify(watch));
    }
  }, [watch, props.localStorageKey]);

  // Combine RHF's isDirty state with our own isLocalStorageApplied state which checks
  // if we applied different values from localStorage than the default values
  const isFormDirty = form.formState.isDirty || isLocalStorageApplied;

  const cleanup = () => {
    window.localStorage.removeItem(props.localStorageKey);
    setIsLocalStorageApplied(false);
    form.reset(form.getValues(), { keepValues: true });
  };

  return {
    ...form,
    isFormDirty,
    cleanup,
  };
}

/**
 * Extend RHF's useForm hook to support server actions.
 *
 * Copied from Github issue about supporting server actions in RHF:
 * https://github.com/react-hook-form/react-hook-form/issues/10391#issuecomment-1888225849
 * */
export function useFormWithAction<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props?: UseFormProps<TFieldValues, TContext>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>(props);

  const handleAction = async (onAction: SubmitHandler<TFieldValues>) => {
    const valid = await form.trigger();
    if (valid) {
      return onAction(form.getValues());
    }
  };

  return {
    ...form,
    handleAction,
  };
}

import { useEffect, useMemo, useState } from "react";
import {
  Path,
  UseFormReset,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
} from "react-hook-form";

import { deepEqual } from "./utils";

/**
 * Extend RHF's useForm hook to support automatic local storage save/apply.
 * Note the custom `isDirty` which combines RHF's isDirty state with a
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
  const isDirty = form.formState.isDirty || isLocalStorageApplied;

  const cleanup = () => {
    console.log("clearing ", props.localStorageKey, "from local storage");
    window.localStorage.removeItem(props.localStorageKey);
    setIsLocalStorageApplied(false);
    form.reset(form.getValues(), { keepValues: true, keepErrors: true });
  };

  /**
   * Extend RHF's reset function to also remove the localStorage item
   */
  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions) => {
    window.localStorage.removeItem(props.localStorageKey);
    setIsLocalStorageApplied(false);
    form.reset(values, keepStateOptions);
  };

  return {
    ...form,
    isDirty,
    cleanup,
    reset,
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

  // Once on mount, apply local storage values if different from default values
  useEffect(() => {
    const isDifferent = Object.entries(defaultValues).some(
      ([key, value]) => !deepEqual(localStorageValues[key], value),
    );

    // We haven't applied local storage values yet, but they are different from
    // the default values. Apply them to the form now.
    if (!isLocalStorageApplied && isDifferent) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (!deepEqual(localStorageValues[key], value)) {
          form.setValue(key as Path<TFieldValues>, localStorageValues[key]);
        }
      });
      setIsLocalStorageApplied(true);
    }
  }, [defaultValues, isLocalStorageApplied, form, localStorageValues]);

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

      const modifiedValues: FieldValues = {};

      // Store File objects in their own FormData object in order to be able to
      // submit in a server action
      Object.entries(formValues).forEach(([key, value]) => {
        if (
          value instanceof Object &&
          !Array.isArray(value) &&
          value.name &&
          value.size
        ) {
          // This is a file object
          const formData = new FormData();
          formData.append(key, value);
          modifiedValues[key] = formData;
        } else {
          modifiedValues[key] = value;
        }
      });

      const result = onAction(modifiedValues as TFieldValues);
      form.reset(form.getValues());
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

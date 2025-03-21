"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

import createStage from "@/actions/createStage";
import AddressFinderInput from "@/components/AddressFinderInput";
import FormToaster from "@/components/FormToaster";
import SubmitButton from "@/components/ui/SubmitButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { stageTypes } from "@/lib/constants";
import {
  CreateStageSchema,
  createStageSchema,
} from "@/lib/form-schemas/stages";
import { useFormCustom, useSelectKey } from "@/lib/hooks";
import { FormServerState } from "@/lib/types";

export const CreateStageForm = () => {
  const LOCAL_STORAGE_KEY = `create-stage-form`;

  const [state, formAction] = useActionState<
    FormServerState,
    CreateStageSchema
  >(createStage, { status: "idle" });

  const router = useRouter();
  if (state.status === "success") {
    router.push("/account/stages");
  }

  const defaultValues: CreateStageSchema = {
    name: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    notes: "",
    type: "",
    latitude: 0,
    longitude: 0,
  };

  const form = useFormCustom<CreateStageSchema>({
    resolver: zodResolver(createStageSchema),
    localStorageKey: LOCAL_STORAGE_KEY,
    defaultValues: defaultValues,
  });

  const { key, updateKey } = useSelectKey();

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
        action={() => form.handleAction(formAction)}
      >
        <FormToaster
          state={state}
          msgs={{ loading: "Creating stage...", success: "Stage created!" }}
        />
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            Create a stage
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add a stage to your theater
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Stage 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full">
            <AddressFinderInput />
          </div>

          {/* Hidden address field. Unhide if we want to make these manually editable. */}
          <div className="hidden">
            <FormField
              control={form.control}
              name="street_address"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="text"
                      placeholder="123 Sesame Street"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="text"
                      placeholder="Sacramento"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="text"
                      placeholder="California"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>ZIP / Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="text"
                      placeholder="12345"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="number"
                      placeholder="38.12345"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly
                      type="number"
                      placeholder="-121.12345"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="sm:col-span-3" key={key}>
                <FormLabel>Stage Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      updateKey();
                    }}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Include anything else you'd like to add."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include anything else you&apos;d like to add.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton>Create</SubmitButton>
      </form>
    </Form>
  );
};

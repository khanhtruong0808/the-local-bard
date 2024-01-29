"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import SubmitButton from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/button";
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
import { useFormWithLocalStorage } from "@/lib/hooks";
import type { TheaterForTheaterPage } from "@/lib/supabase/queries";
import updateTheater from "@/actions/updateTheater";
import {
  UpdateTheaterSchema,
  updateTheaterSchema,
} from "@/lib/form-schemas/theaters";

interface TheaterFormProps {
  theater: TheaterForTheaterPage;
}

export const TheaterForm = ({ theater }: TheaterFormProps) => {
  const LOCAL_STORAGE_KEY = `update-theater-form`;

  const address = theater.addresses;

  const defaultValues = useMemo(
    () => ({
      id: theater.id,
      address_id: address?.id || undefined,
      name: theater.name || "",
      street_address: address?.street_address || undefined,
      city: address?.city || "",
      state: address?.state || "",
      postal_code: address?.postal_code || null,
      notes: theater.notes || "",
      parking_instructions: theater.parking_instructions || "",
      url: theater.url || "",
      type: theater.type || "",
      concessions: theater.concessions || "",
    }),
    [theater, address],
  );
  const form = useFormWithLocalStorage<UpdateTheaterSchema>({
    resolver: zodResolver(updateTheaterSchema),
    defaultValues: defaultValues,
    localStorageKey: LOCAL_STORAGE_KEY,
  });

  const handleSubmit = async (formData: FormData) => {
    toast
      .promise(
        updateTheater(formData),
        {
          loading: "Updating Theater...",
          success: "Theater Updated!",
          error: (error: Error) => error.message,
        },
        {
          style: {
            minWidth: "250px",
          },
        },
      )
      .then(({ status }) => {
        if (status === "success") {
          form.cleanup();
        }
      });
  };

  return (
    <Form {...form}>
      <form action={handleSubmit} onReset={() => form.reset(defaultValues)}>
        <h2 className="text-base font-semibold leading-7 text-zinc-200">
          {theater.name || "My Theater"}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
        {form.isFormDirty && (
          <p className="text-sm font-medium text-red-500 dark:text-red-600">
            You have unsaved changes. Make sure to press <strong>Update</strong>{" "}
            to save them before leaving.
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
          <input type="hidden" {...form.register("id")} />
          <input type="hidden" {...form.register("address_id")} />
          {/* Possibly implement later if that is a feature we'd like? */}
          {/* <div className="col-span-full">
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="photo"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  className="h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <Button type="button">Change</Button>
              </div>
            </div> */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Theater Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="My Theater" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="123 Sesame Street"
                    {...field}
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
                  <Input type="text" placeholder="Sacramento" {...field} />
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
                  <Input type="text" placeholder="California" {...field} />
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
                    type="number"
                    placeholder="12345"
                    {...field}
                    value={field.value ?? undefined}
                  />
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
                  Other characterstics useful to the attendee.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parking_instructions"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Parking Instructions</FormLabel>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
                <FormDescription>
                  List any parking instructions here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Theater Type</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theater type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Junior College">
                        Junior College
                      </SelectItem>
                      <SelectItem value="Equity Theater">
                        Equity Theater
                      </SelectItem>
                      <SelectItem value="Play House">Play House</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="concessions"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Concessions</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <div>
            {form.isFormDirty && (
              <Button type="reset" variant="secondary" className="mr-4">
                Cancel
              </Button>
            )}
            <SubmitButton isFormDirty={form.isFormDirty}>
              Update Theater
            </SubmitButton>
          </div>
        </div>
      </form>
    </Form>
  );
};

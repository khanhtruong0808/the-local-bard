"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

import deleteStage from "@/actions/deleteStage";
import updateStage from "@/actions/updateStage";
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
import { stageTypes } from "@/lib/constants";
import { updateStageSchema } from "@/lib/form-schemas/stages";
import { useFormWithLocalStorage } from "@/lib/hooks";
import { StageWithAddress } from "@/lib/supabase/queries";
import { boolToYN, ynToBool } from "@/lib/utils";
import useDialog from "@/utils/dialogStore";
import { ConfirmDeleteForm } from "./ConfirmDeleteForm";
import AddressFinderInput from "../AddressFinderInput";

interface UpdateStageFormProps {
  stage: StageWithAddress;
}

export const UpdateStageForm = ({ stage }: UpdateStageFormProps) => {
  const LOCAL_STORAGE_KEY = `update-stage-form-${stage.id}`;

  const [isDeleting, setIsDeleting] = useState(false);
  const { openDialog, closeDialog } = useDialog();

  const address = stage.addresses;

  const defaultValues = useMemo(
    () => ({
      id: stage.id,
      name: stage.name || "",
      street_address: address.street_address || undefined,
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || undefined,
      type: stage.type || "",
      wheelchair_accessible: stage.wheelchair_accessible ?? undefined,
      seating_capacity: stage.seating_capacity || undefined,
      notes: stage.notes || "",
      address_id: stage.address_id || undefined,
    }),
    [stage, address],
  );

  const form = useFormWithLocalStorage<z.infer<typeof updateStageSchema>>({
    resolver: zodResolver(updateStageSchema),
    defaultValues: defaultValues,
    localStorageKey: LOCAL_STORAGE_KEY,
  });

  const handleSubmit = async (formData: FormData) => {
    toast
      .promise(
        updateStage(formData),
        {
          loading: "Updating Stage...",
          success: "Stage Updated!",
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

  const handleDelete = async () => {
    setIsDeleting(true);
    await toast.promise(
      deleteStage(stage.id),
      {
        loading: "Deleting Stage...",
        success: "Stage Deleted!",
        error: (error: Error) => error.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
    setIsDeleting(false);
    closeDialog();
  };

  const handleConfirmDelete = () => {
    openDialog({
      title: "Delete stage",
      content: <ConfirmDeleteForm handleDelete={handleDelete} />,
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
        action={handleSubmit}
        onReset={() => form.reset(defaultValues)}
      >
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            {stage.name}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Make changes to your stage here.
          </p>
          {form.isFormDirty && (
            <p className="text-sm font-medium text-red-500 dark:text-red-600">
              You have unsaved changes. Make sure to press{" "}
              <strong>Update</strong> to save them before leaving.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
          <input type="hidden" id="id" {...form.register("id")} />
          <input
            type="hidden"
            id="address_id"
            {...form.register("address_id")}
          />
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
          <hr className="col-span-full mt-6" />
          <div className="col-span-full">
            <h3 className="text-base font-semibold leading-7 text-zinc-200">
              Address
            </h3>
            <p className="text-sm dark:text-zinc-400">
              Either use the address finder below or enter your address
              manually.
            </p>
          </div>
          <div className="col-span-full">
            <AddressFinderInput />
          </div>
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
                    {...field}
                    type="number"
                    placeholder="12345"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value !== ""
                          ? parseInt(e.target.value)
                          : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="col-span-full mt-6" />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Stage Type</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
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
            name="wheelchair_accessible"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Wheel Chair Accessible</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    name="wheelchair_accessible"
                    onValueChange={(v) => {
                      field.onChange(ynToBool(v));
                    }}
                    value={boolToYN(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seating_capacity"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Seating Capacity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="100"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                  Include anything else you&apos;d like to add.
                </FormDescription>
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
            <SubmitButton>Update</SubmitButton>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            Delete Stage
          </Button>
        </div>
      </form>
    </Form>
  );
};

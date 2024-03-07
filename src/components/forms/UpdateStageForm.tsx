"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";

import deleteStage from "@/actions/deleteStage";
import updateStage from "@/actions/updateStage";
import AddressFinderInput from "@/components/AddressFinderInput";
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
import {
  UpdateStageSchema,
  updateStageSchema,
} from "@/lib/form-schemas/stages";
import { useFormCustom, useSelectKey } from "@/lib/hooks";
import { StageWithAddress } from "@/lib/supabase/queries";
import { type FormServerState } from "@/lib/types";
import { boolToYN } from "@/lib/utils";
import useDialog from "@/utils/dialogStore";
import FormToaster from "../FormToaster";
import { ConfirmDeleteForm } from "./ConfirmDeleteForm";

interface UpdateStageFormProps {
  stage: StageWithAddress;
}

export const UpdateStageForm = ({ stage }: UpdateStageFormProps) => {
  // This is a janky way to set formState back to idle after a success/error.
  const [formKey, setFormKey] = useState(0);
  const resetFormState = () => {
    setFormKey((k) => k + 1);
  };
  return (
    <UpdateStageFormInternal
      stage={stage}
      key={formKey}
      resetFormState={resetFormState}
    />
  );
};

const UpdateStageFormInternal = ({
  stage,
  resetFormState,
}: UpdateStageFormProps & { resetFormState: () => void }) => {
  const LOCAL_STORAGE_KEY = `update-stage-form-${stage.id}`;

  const [state, formAction] = useFormState<FormServerState, UpdateStageSchema>(
    updateStage,
    {
      status: "idle",
    },
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const { openDialog, closeDialog } = useDialog();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    if (state.status !== "idle") {
      timeoutId = setTimeout(() => {
        resetFormState();
      }, 2000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [state, resetFormState]);

  const address = stage.addresses;

  const defaultValues: UpdateStageSchema = {
    id: stage.id,
    name: stage.name || "",
    street_address: address.street_address,
    city: address.city,
    state: address.state || "",
    postal_code: address.postal_code || "",
    type: stage.type || "",
    wheelchair_accessible:
      stage.wheelchair_accessible !== null
        ? boolToYN(stage.wheelchair_accessible)
        : "",
    seating_capacity: stage.seating_capacity || 0,
    notes: stage.notes || "",
    address_id: stage.address_id || "",
    concessions: stage.concessions || "",
    parking_instructions: stage.parking_instructions || "",
    latitude: address.latitude || 0,
    longitude: address.longitude || 0,
  };

  const form = useFormCustom<UpdateStageSchema>({
    resolver: zodResolver(updateStageSchema),
    defaultValues: defaultValues,
    localStorageKey: LOCAL_STORAGE_KEY,
  });

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await toast.promise(
        (async () => {
          const res = await deleteStage(stage.id);
          if (res.status === "error") {
            throw new Error(res.error);
          }
        })(),
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
    } catch (error) {
      console.error(error);
    }
    setIsDeleting(false);
    closeDialog();
  };

  const handleConfirmDelete = () => {
    openDialog({
      title: "Delete stage",
      content: <ConfirmDeleteForm handleDelete={handleDelete} />,
    });
  };

  const { key, updateKey } = useSelectKey();

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
        action={() => {
          form.handleAction(formAction);
        }}
        onReset={() => form.reset(defaultValues)}
      >
        <FormToaster
          state={state}
          msgs={{ loading: "Updating stage...", success: "Stage updated!" }}
        />
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            {stage.name}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Make changes to your stage here.
          </p>
          {form.isDirty && (
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

          <div className="col-span-full">
            <AddressFinderInput description="Enter the address of the stage." />
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
                  <FormLabel>City</FormLabel>,
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
                    <Input {...field} readOnly type="text" placeholder="CA" />
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
          {/* End of hidden fields */}

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
            name="wheelchair_accessible"
            render={({ field }) => (
              <FormItem className="sm:col-span-3" key={key}>
                <FormLabel>Wheelchair Accessible?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      updateKey();
                    }}
                    value={field.value}
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
                    onChange={(e) =>
                      field.onChange(
                        e.target.value !== "" ? parseInt(e.target.value) : "",
                      )
                    }
                  />
                </FormControl>
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
            {form.isDirty && (
              <Button type="reset" variant="secondary" className="mr-4">
                Cancel
              </Button>
            )}
            <SubmitButton disabled={!form.isDirty}>Update</SubmitButton>
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

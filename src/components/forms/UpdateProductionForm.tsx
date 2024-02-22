"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

import deleteProduction from "@/actions/deleteProduction";
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import SubmitButton from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { commonPlaywrigthts, commonProductions, genres } from "@/lib/constants";
import {
  updateProductionSchema,
  type UpdateProductionSchema,
} from "@/lib/form-schemas/productions";
import { useFormCustom, useSelectKey } from "@/lib/hooks";
import { createClient } from "@/lib/supabase/client";
import type {
  Production,
  TheaterForUpdateProduction,
} from "@/lib/supabase/queries";
import { boolToYN } from "@/lib/utils";
import useDialog from "@/utils/dialogStore";
import { SubmitHandler } from "react-hook-form";

interface ProductionFormProps {
  production: Production;
  theater: TheaterForUpdateProduction;
}

export function UpdateProductionForm({
  production,
  theater,
}: ProductionFormProps) {
  const LOCAL_STORAGE_KEY = `update-production-form-${production.id}`;
  const supabase = createClient();

  const defaultValues: UpdateProductionSchema = {
    id: production.id,
    name: production.name || "",
    summary: production.summary || "",
    stage_id: production.stage_id,
    playwrights: production.playwrights || [],
    directors: production.directors || [],
    composers: production.composers || [],
    genres: production.genres || [],
    kid_friendly: boolToYN(production.kid_friendly),
    cost_range: production.cost_range || "",
    duration_minutes: production.duration_minutes || 0,
    poster: undefined,
    url: production.url || "",
    notes: production.notes || "",
    start_date: production.start_date,
    end_date: production.end_date,
  };

  const form = useFormCustom<UpdateProductionSchema>({
    resolver: zodResolver(updateProductionSchema),
    defaultValues: defaultValues,
    localStorageKey: LOCAL_STORAGE_KEY,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(
    production.poster_url,
  );
  const [imageKey, setImageKey] = useState(0);
  const { openDialog, closeDialog } = useDialog();
  const { key, updateKey } = useSelectKey();

  // Update the poster image when a new file is selected
  const handlePosterChange = (file: File | undefined) => {
    if (file) {
      setPosterUrl(URL.createObjectURL(file));
    } else {
      setPosterUrl(production.poster_url);
      setImageKey((key) => key + 1);
    }
  };

  // Revert the poster to the original poster
  const handleRevertPoster = () => {
    setPosterUrl(production.poster_url);
    setImageKey((key) => key + 1);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await toast.promise(
      deleteProduction(production.id),
      {
        loading: "Deleting Production...",
        success: "Production Deleted!",
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

  // Open a confirmation dialog before deleting the production
  const handleConfirmDelete = () => {
    openDialog({
      title: "Delete production",
      content: <ConfirmDeleteForm handleDelete={handleDelete} />,
    });
  };

  const handleReset = () => {
    handleRevertPoster();
    form.reset(defaultValues);
  };

  const onSubmit: SubmitHandler<UpdateProductionSchema> = async (formData) => {
    await toast.promise(
      (async () => {
        // Upload new poster image if included in form data
        const poster = formData.poster;
        if (poster && poster.name && poster.size) {
          const { error: fileError } = await supabase.storage
            .from("posters")
            .upload(poster.name, poster, {
              upsert: true,
            });

          if (fileError) return Promise.reject(fileError);

          const {
            data: { publicUrl },
          } = supabase.storage.from("posters").getPublicUrl(poster.name);

          formData.poster_url = publicUrl;
          delete formData.poster;
        }

        const endpoint = `/api/productions/${production.id}`;
        const res = await fetch(endpoint, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const { error } = (await res.json()) as { error: string };
          console.error(error);
          return Promise.reject(new Error(error));
        }
        form.reset(formData);
      })(),
      {
        loading: "Updating production...",
        success: "Production updated!",
        error: (err: Error) => err.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
  };

  // Show warning if the poster image is not close to 3:4 aspect ratio
  const handleImageLoad = (e: any) => {
    const img = e.target;
    const aspectRatio = img.width / img.height;
    if (aspectRatio < 0.6 || aspectRatio > 0.9) {
      form.setError("poster", {
        type: "manual",
        message:
          "WARNING: Poster image should be close to 3:4 aspect ratio for best results. (e.g. 300x400px)",
      });
    } else {
      // clear errors if user has fixed the aspect ratio
      form.clearErrors("poster");
    }
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={handleReset}
      >
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            {production.name}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Make changes to your production here.
          </p>
          {form.isDirty && (
            <p className="text-sm font-medium text-red-500 dark:text-red-600">
              You have unsaved changes. Make sure to press{" "}
              <strong>Update</strong> to save them before leaving.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
          <input type="hidden" {...form.register("id")} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="The Lion King"
                    {...field}
                    list="title"
                  />
                </FormControl>
                <datalist id="titles">
                  {commonProductions.map((title) => (
                    <option key={title} value={title} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="The stage musical adapted from Disney's animated classic of the same name."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Include a few details about your production.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage_id"
            render={({ field }) => (
              <FormItem className="col-span-full" key={key}>
                <FormLabel>Stage</FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v);
                    updateKey();
                  }}
                  defaultValue={field.value === 0 ? "" : field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {theater.stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genres"
            render={() => (
              <FormItem className="col-span-full">
                <div className="mb-4">
                  <FormLabel className="text-base">Genres</FormLabel>
                  <FormDescription>
                    Select all genres that apply to your production.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                  {genres.map((genre) => (
                    <FormField
                      key={genre}
                      control={form.control}
                      name="genres"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={genre}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(genre)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, genre])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== genre,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {genre}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="playwrights"
            render={({ field }) => (
              <FormItem className="sm:col-span-3 sm:col-start-1">
                <FormLabel>Playwrights</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Roger Allers, Irene Mecchi"
                    onChange={(e) => {
                      field.onChange(e.target.value.split(", "));
                    }}
                    value={field.value?.join(", ") || ""}
                    list="playwrights"
                  />
                </FormControl>
                <datalist id="playwrights">
                  {commonPlaywrigthts.map((playwright) => (
                    <option key={playwright} value={playwright} />
                  ))}
                </datalist>
                <FormDescription>
                  Separate multiple playwrights with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="directors"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Directors</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="John Doe, Jane Doe"
                    onChange={(e) => {
                      field.onChange(e.target.value.split(", "));
                    }}
                    value={field.value?.join(", ") || ""}
                  />
                </FormControl>
                <FormDescription>
                  Separate multiple directors with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="composers"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Composers</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Elton John, Julie Taymor"
                    onChange={(e) => {
                      field.onChange(e.target.value.split(", "));
                    }}
                    value={field.value?.join(", ") || ""}
                  />
                </FormControl>
                <FormDescription>
                  Separate multiple composers with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kid_friendly"
            render={({ field }) => (
              <FormItem className="sm:col-span-3" key={key}>
                <FormLabel>Kid Friendly</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      updateKey();
                    }}
                    defaultValue={field.value}
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
            name="cost_range"
            render={({ field }) => (
              <FormItem className="sm:col-span-3" key={key}>
                <FormLabel>Cost Range</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      updateKey();
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cost range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">{"$ ($20 or less)"}</SelectItem>
                      <SelectItem value="$$">{"$$ ($21 to $50)"}</SelectItem>
                      <SelectItem value="$$$">{" $$$ ($51 to $99)"}</SelectItem>
                      <SelectItem value="$$$$">
                        {"$$$$ ($100 or more)"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="120"
                    onChange={(e) => {
                      field.onChange(
                        e.target.value !== "" ? parseInt(e.target.value) : "",
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poster"
            render={({ field }) => (
              <FormItem className="h-full sm:col-span-3">
                <FormLabel htmlFor="poster">Poster</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    key={imageKey}
                    accept={"image/jpeg, image/png, image/webp, image/svg+xml"}
                    className="h-min w-full cursor-pointer p-0 text-sm text-zinc-400 file:mr-2 file:cursor-pointer file:rounded-md file:rounded-r-none file:border-none file:bg-transparent file:bg-zinc-700 file:px-2.5 file:py-1.5 file:text-zinc-100 file:hover:bg-zinc-600 file:active:bg-zinc-700 file:active:text-zinc-100/70"
                    onChange={(e) => {
                      field.onChange(e.target.files?.[0]);
                      handlePosterChange(e.target.files?.[0]);
                    }}
                    value={undefined}
                  />
                </FormControl>
                <FormDescription>jpeg, png, webp, or svg only!</FormDescription>
                <FormMessage />
                {posterUrl !== production.poster_url && (
                  <Button
                    variant="secondary"
                    className="mb-8 self-start"
                    type="button"
                    onClick={() => handleRevertPoster()}
                  >
                    Revert Poster
                  </Button>
                )}
              </FormItem>
            )}
          />
          <div className="mx-auto mt-8 max-w-fit sm:col-span-3">
            <div className="overflow-hidden rounded-lg bg-zinc-700 shadow">
              <div className="sm:flex">
                <div className="ml-2 flex-shrink-0 self-center pl-4 sm:mb-0 sm:mr-4">
                  {posterUrl && (
                    <Image
                      src={posterUrl}
                      onLoad={handleImageLoad}
                      alt={production.name || "Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    {production.name}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-zinc-400">
                    <p>{theater?.name}</p>
                    <p>{theater.addresses?.street_address}</p>
                    <p>
                      {theater.addresses?.city}, {theater.addresses?.state}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    {...field}
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
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="sm:col-span-3 sm:col-start-1">
                <FormLabel>Opening Night</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>Closing Night</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
            <SubmitButton
              disabled={!form.isDirty || form.formState.isSubmitting}
            >
              Update
            </SubmitButton>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            Delete Production
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ReactEventHandler } from "react";
import { SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

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
  createProductionSchema,
  type CreateProductionSchema,
} from "@/lib/form-schemas/productions";
import { useFormCustom, useSelectKey } from "@/lib/hooks";
import type { TheaterForNewProduction } from "@/lib/supabase/queries";

import { createClient } from "@/lib/supabase/client";

interface ProductionFormProps {
  theater: TheaterForNewProduction;
}

export function CreateProductionForm({ theater }: ProductionFormProps) {
  const LOCAL_STORAGE_KEY = `create-production-form`;
  const supabase = createClient();

  const router = useRouter();
  // if (state.status === "success") {
  //   router.push("/account/productions");
  // }

  const defaultValues: CreateProductionSchema = {
    theater_id: theater.id,
    stage_id: 0,
    name: "",
    summary: "",
    playwrights: [],
    directors: [],
    composers: [],
    genres: [],
    kid_friendly: "Yes",
    cost_range: "",
    duration_minutes: 0,
    poster: undefined,
    url: "",
    notes: "",
    start_date: "",
    end_date: "",
  };

  const form = useFormCustom<CreateProductionSchema>({
    resolver: zodResolver(createProductionSchema),
    localStorageKey: LOCAL_STORAGE_KEY,
    defaultValues: defaultValues,
  });

  const [posterUrl, setPosterUrl] = useState<string | undefined>();
  const [imageKey, setImageKey] = useState(0);

  const { key, updateKey } = useSelectKey();

  // Update the posterUrl when the user selects a new poster
  const handlePosterChange = (file: File | undefined) => {
    const url = file ? URL.createObjectURL(file) : "";
    if (!file) setImageKey(imageKey + 1);
    setPosterUrl(url);
  };

  // Show warning if the poster image is not close to 3:4 aspect ratio
  const handleImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
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

  const onSubmit: SubmitHandler<CreateProductionSchema> = async (formData) => {
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

        const endpoint = "/api/productions";
        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const { error } = (await res.json()) as { error: string };
          console.error(error);
          return Promise.reject(new Error(error));
        }
        form.reset(defaultValues);
        router.push("/account/productions/new/success");
      })(),
      {
        loading: "Creating production...",
        success: "Production created!",
        error: (err: Error) => err.message,
      },
      {
        style: {
          minWidth: "250px",
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-base font-semibold leading-7 text-zinc-200">
            Create a Production
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Add a production to your theater.
          </p>
          {(form.isDirty || posterUrl !== undefined) && (
            <p className="text-sm font-medium text-red-500 dark:text-red-600">
              You have unsaved changes. Make sure to submit this form before
              leaving.
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-gray-200 py-6 sm:grid-cols-6 md:col-span-2">
          <input type="hidden" {...form.register("theater_id")} />
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
                    list="titles"
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
            render={({ field }) => (
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
                    onChange={(e) =>
                      field.onChange(
                        e.target.value !== "" ? parseInt(e.target.value) : 0,
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
                {posterUrl && (
                  <Button
                    variant="secondary"
                    className="mb-8 self-start"
                    type="button"
                    onClick={() => handlePosterChange(undefined)}
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
                      alt={"Production poster"}
                      width={100}
                      height={100}
                    />
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-zinc-200">
                    Production Title
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
        <SubmitButton disabled={!form.isDirty || form.formState.isSubmitting}>
          Create new production
        </SubmitButton>
      </form>
    </Form>
  );
}

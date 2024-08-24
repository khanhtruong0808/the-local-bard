"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { sendNewTheaterEmail } from "@/actions/sendNewTheaterEmail";
import AddressFinderInput from "@/components/AddressFinderInput";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { theaterTypes } from "@/lib/constants";
import { SignUpSchema, signUpSchema } from "@/lib/form-schemas/sign-up";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.error(error);
      alert(error);
    }
  }, [error]);

  const supabase = createClient();

  const onSubmit = async (values: SignUpSchema) => {
    // Sign up the user in Supabase auth (still needs verification)
    const {
      data: { user, session },
      error,
    } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (!user) {
      console.log("No user");
      setError("No user");
      return;
    }

    // Create an address for the user
    const { data: address, error: createAddressError } = await supabase
      .from("addresses")
      .insert({
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
        latitude: values.latitude,
        longitude: values.longitude,
      })
      .select()
      .single();

    if (createAddressError) {
      console.log(createAddressError);
      setError(createAddressError.message);
      return;
    }

    if (!address) {
      console.log("No address");
      setError("No address");
      return;
    }

    // Create a profile for the user
    const { data, error: createProfileError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        address_id: address.id,
      });

    if (createProfileError) {
      console.log(createProfileError);
      setError(createProfileError.message);
      return;
    }

    // Create theater for the user
    const { data: theater, error: createTheaterError } = await supabase
      .from("theaters")
      .insert({
        name: values.theaterName,
        type: values.theaterType,
        url: values.websiteUrl,
        manager_id: user.id,
        address_id: address.id,
      })
      .select()
      .single();

    if (createTheaterError) {
      console.log(createTheaterError);
      setError(createTheaterError.message);
      return;
    }

    if (!theater) {
      console.log("No theater");
      setError("No theater");
      return;
    }

    // Send email to admin to verify new theater
    const emailFormData = new FormData();
    emailFormData.append("first_name", values.firstName);
    emailFormData.append("last_name", values.lastName);
    emailFormData.append("theater_name", values.theaterName);
    const result = await sendNewTheaterEmail(emailFormData);
    if (result.status === "error") {
      console.error(result.error);
      setError(result.error);
      return;
    }

    router.push("/sign-up/check-email");
    return;
  };

  const onError = (error: any) => {};

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      theaterName: "",
      theaterType: "",
      websiteUrl: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-7xl lg:mx-0 lg:max-w-none"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 py-6 sm:grid-cols-6 md:col-span-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theaterName"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Theater Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Theater Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theaterType"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Theater Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theater type" />
                    </SelectTrigger>
                    <SelectContent>
                      {theaterTypes.map((type) => (
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
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://www.example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-full">
            <AddressFinderInput description="Enter your theater company's mailing address." />
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
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="flex w-full justify-center"
        >
          Sign Up
        </Button>
        {/* <SubmitButton size="lg" className="flex w-full justify-center">
          Sign Up
        </SubmitButton> */}
        <ErrorMessage error={error} />
      </form>
    </Form>
  );
}

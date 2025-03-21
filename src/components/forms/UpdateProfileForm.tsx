"use client";

import { AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import { useActionState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/ui/SubmitButton";
import { Profile } from "@/lib/supabase/queries";
import { FormServerState } from "@/lib/types";

export const UpdateProfileForm = ({
  profile,
  action,
}: {
  profile: Profile;
  action: (
    currentState: FormServerState,
    formData: FormData,
  ) => Promise<FormServerState>;
}) => {
  const [state, formAction] = useActionState<FormServerState, FormData>(
    action,
    {
      status: "idle",
    },
  );
  const [profileUrl, setProfileUrl] = useState(profile.profile_image_url);
  const [imageKey, setImageKey] = useState(0);

  // Update the poster image when a new file is selected
  const handleProfileImageChange = (file: File | undefined) => {
    if (file) {
      setProfileUrl(URL.createObjectURL(file));
    } else {
      setProfileUrl(profile.profile_image_url);
      setImageKey((key) => key + 1);
    }
  };

  // Revert the poster to the original poster
  const handleRevertProfileImage = () => {
    setProfileUrl(profile.profile_image_url);
    setImageKey((key) => key + 1);
  };

  return (
    <form action={formAction}>
      <h2 className="text-base leading-7 font-semibold text-zinc-200">
        Update profile
      </h2>
      <div className="mt-6 space-y-4 border-t border-gray-200 py-6">
        <div>
          {state.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state.status === "success" && (
            <Alert variant="success">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Profile updated.</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="col-span-full">
          <div className="mt-2 flex items-center gap-x-3">
            <label
              htmlFor="profileImage"
              className="inline-block h-48 w-48 overflow-hidden rounded-full bg-gray-100 hover:cursor-pointer"
            >
              {profileUrl ? (
                <Avatar className="h-48 w-48">
                  <AvatarImage src={profileUrl} />
                </Avatar>
              ) : (
                <svg
                  className="text-muted-foreground h-full w-full"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </label>

            <div className="flex gap-4 self-end">
              {profileUrl !== profile.profile_image_url &&
                state.status === "idle" && (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => handleRevertProfileImage()}
                  >
                    Cancel
                  </Button>
                )}
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                className="hidden"
                onChange={(e) => handleProfileImageChange(e.target.files?.[0])}
                key={imageKey}
              />
            </div>
          </div>
        </div>
      </div>
      <SubmitButton disabled={profileUrl === profile.profile_image_url}>
        Update Profle
      </SubmitButton>
    </form>
  );
};

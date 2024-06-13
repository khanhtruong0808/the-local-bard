import { createClient } from "@/lib/supabase/server";
import { UpdateProfileForm } from "@/components/forms/UpdateProfileForm";
import { getMaybeUser, getProfile } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FormServerState } from "@/lib/types";
import { revalidatePath } from "next/cache";

const updateProfileSchema = z.object({
  profileImage: z.custom<File>(),
});

export default async function UpdateProfilePage() {
  async function updateProfile(
    currentState: FormServerState,
    formData: FormData,
  ): Promise<FormServerState> {
    "use server";
    const supabase = createClient();
    const parsed = updateProfileSchema.safeParse({
      profileImage: formData.get("profileImage"),
    });

    if (!parsed.success) {
      return {
        status: "error",
        error: parsed.error.errors.map((e) => e.message).join("\n"),
      };
    }

    const { profileImage } = parsed.data;

    // Upload new poster image if included in form data
    let profileImageUrl;
    if (profileImage && profileImage.name && profileImage.size) {
      const { error: fileError } = await supabase.storage
        .from("profile_images")
        .upload(profileImage.name, profileImage, {
          upsert: true,
        });

      if (fileError) return Promise.reject(fileError);

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("profile_images")
        .getPublicUrl(profileImage.name);

      profileImageUrl = publicUrl;
    }

    const user = await getMaybeUser(supabase);
    if (!user) return { status: "error", error: "No user found." };

    const update = await supabase
      .from("profiles")
      .update({
        profile_image_url: profileImageUrl,
      })
      .eq("user_id", user.id);

    revalidatePath("/account/profile");
    if (update.error) return { status: "error", error: update.error.message };
    return { status: "success" };
  }

  const supabase = createClient();
  const user = await getMaybeUser(supabase);
  if (!user) return null;

  const { data: profile, error: profileError } = await getProfile(
    supabase,
    user.id,
  );

  if (profileError || !profile) redirect("/");

  return (
    <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
      <UpdateProfileForm profile={profile} action={updateProfile} />
    </div>
  );
}

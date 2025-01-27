"use server";

/**
 * This is not in use because it was hard to integrate server actions with RHF
 * and file uploads. Currently just using handleSubmit and an API route handler
 * until server actions are better integrated with RHF.
 */

// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

// import {
//   updateProductionServerSchema,
//   type UpdateProductionSchema,
// } from "@/lib/form-schemas/productions";
// import { createClient } from "@/lib/supabase/server";
// import { FormServerState } from "@/lib/types";

// export default async function updateProduction(
//   currentState: FormServerState,
//   form: UpdateProductionSchema,
// ): Promise<FormServerState> {
//   console.log("form from updateProduction:", form);
//   const parsed = updateProductionServerSchema.safeParse(form);
//   if (!parsed.success) {
//     console.log(form);
//     const error = parsed.error.errors.map((e) => e.message).join("\n");
//     return { status: "error", error: error };
//   }

//   const supabase = await createClient();

//   const { id, poster, ...updatedProduction } = parsed.data;

//   const posterFile = poster ? poster.get("poster") : null;

//   if (posterFile && posterFile instanceof File && posterFile.size > 0) {
//     const { error: fileError } = await supabase.storage
//       .from("posters")
//       .upload(posterFile.name, posterFile, {
//         upsert: true,
//       });

//     if (fileError) {
//       throw fileError.message; // We actually want to see this error logged
//     }

//     const { data } = supabase.storage
//       .from("posters")
//       .getPublicUrl(posterFile.name);

//     const { publicUrl: poster_url } = data;
//     updatedProduction.poster_url = poster_url;
//   } else {
//     // TODO: Figure out how to actually delete orphaned posters from storage?
//     // keep old poster_url if no file is given
//   }

//   const { error } = await supabase
//     .from("productions")
//     .update({
//       ...updatedProduction,
//     })
//     .eq("id", id);

//   if (error) return { status: "error", error: error.message };

//   revalidatePath(`/account/productions/${id}`);

//   return { status: "success" };
// }

"use client";

import useDialog from "@/utils/dialogStore";
import { Button } from "./ui/button";

export const AspectRatioWarning = () => {
  const { closeDialog } = useDialog();

  return (
    <div className="mt-8 flex flex-col space-y-8 text-white">
      <p className="text-bold text-gray-300">
        The uploaded poster is not in a 3:4 aspect ratio.
      </p>
      <p className="text-bold text-gray-300">
        The poster may appear warped or stretched when displayed. Consider
        uploading a poster that is within this aspect ratio for best results.
      </p>
      <Button className="self-end" onClick={closeDialog}>
        I Understand
      </Button>
    </div>
  );
};

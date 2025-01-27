// For use with useActionState actions
export type FormServerState =
  | {
      status: "success";
      data?: any;
    }
  | {
      status: "error";
      error: string;
    }
  | {
      status: "idle";
    };

// Search params automatically passed to page.tsx by Next.js
export interface RouteSearchParams {
  [key: string]: string | string[] | undefined;
}

// For use with useFormState actions
export interface FormState {
  message?: string;
  error?: string;
}

// Search params automatically passed to page.tsx by Next.js
export interface RouteSearchParams {
  [key: string]: string | string[] | undefined;
}

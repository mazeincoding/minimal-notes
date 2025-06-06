interface IError {
  code: string;
  message: string;
}

export const errors: IError[] = [
  {
    code: "UNAUTHORIZED",
    message: "Please sign in to continue",
  },
  {
    code: "FAILED_TO_CREATE_NOTE",
    message: "Failed to create note. Please try again.",
  },
  {
    code: "FAILED_TO_UPDATE_NOTE",
    message: "Failed to save changes. Please try again.",
  },
  {
    code: "FAILED_TO_FETCH_NOTES",
    message: "Failed to load notes. Please refresh the page.",
  },
  {
    code: "NOTE_NOT_FOUND",
    message: "Note not found. It may have been deleted.",
  },
];

// Utility function to get user-friendly error message
export function getErrorMessage(errorCode: string): string {
  const error = errors.find((e) => e.code === errorCode);
  return error?.message || "Something went wrong. Please try again.";
}

// Simple error mapping for API responses
export function getErrorCode(response: Response, errorText?: string): string {
  if (response.status === 401) return "UNAUTHORIZED";
  if (response.status === 404) return "NOTE_NOT_FOUND";

  if (errorText?.includes("Failed to create note"))
    return "FAILED_TO_CREATE_NOTE";
  if (errorText?.includes("Failed to update note"))
    return "FAILED_TO_UPDATE_NOTE";
  if (errorText?.includes("Failed to fetch notes"))
    return "FAILED_TO_FETCH_NOTES";

  return "FAILED_TO_CREATE_NOTE"; // Default fallback
}

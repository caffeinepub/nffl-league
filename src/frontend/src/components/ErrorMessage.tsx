import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({
  message = "Something went wrong. Please try again.",
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <AlertCircle className="h-12 w-12 text-destructive opacity-70" />
      <div>
        <p className="text-lg font-ui font-semibold text-foreground">
          Unable to load data
        </p>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
    </div>
  );
}

import { useMutation } from "@tanstack/react-query";

export default function useMailchimpSubscribe() {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
          const error: Error & { status?: number } = new Error(
            data.message || "Subscription failed."
          );
          error.status = response.status;
          throw error;
        }

        return data;
      } catch (error: unknown) {
        console.error("useMailchimpSubscribe error:", error);
        throw error;
      }
    },
  });
}

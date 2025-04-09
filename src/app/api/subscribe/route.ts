import { NextRequest, NextResponse } from "next/server";
import mailchimp from "@/lib/mailchimp";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID!,
      {
        email_address: email,
        status: "pending",
      }
    );

    return NextResponse.json({ message: "Subscription successful" });
  } catch (error: unknown) {
    console.error("Subscription error:", error);

    let errorMessage = "Subscription failed. Please try again later.";
    let errorStatus = 500;

    // Check if the error is an object and has status/detail properties (common in API errors)
    if (typeof error === "object" && error !== null) {
      if ("status" in error && typeof error.status === "number") {
        errorStatus = error.status;
      }
      // Attempt to get a more specific message from the error object
      // Mailchimp errors often have a 'detail' property in the response body or directly on the error
      if (
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "body" in error.response
      ) {
        const responseBody = error.response.body as Record<string, unknown>; // Assume body is an object
        if (responseBody && typeof responseBody.detail === "string") {
          errorMessage = responseBody.detail;
        } else if (responseBody && typeof responseBody.title === "string") {
          errorMessage = responseBody.title; // Fallback to title if detail is not present
        }
      } else if ("detail" in error && typeof error.detail === "string") {
        errorMessage = error.detail; // Check if detail is directly on the error
      } else if (error instanceof Error) {
        errorMessage = error.message; // Fallback to generic error message
      }

      // Check for specific Mailchimp "already subscribed" error
      if (errorMessage.includes("is already a list member")) {
        errorMessage =
          "You have already subscribed to receive emails from Eliza.";
        // Optionally, consider changing the status code if 400 doesn't feel right for this case
        // For example, some might use 409 Conflict, but 400 is also common.
      }
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: errorStatus }
    );
  }
}

import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Next.js 16: uses proxy.ts instead of middleware.ts
// Export must be named "proxy" (not "middleware")
const clerkHandler = clerkMiddleware();

export async function proxy(request: NextRequest) {
  return clerkHandler(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

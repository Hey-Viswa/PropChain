import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/registry(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/properties/token/(.*)",
]);

const isOracleRoute = createRouteMatcher([
  "/oracle(.*)",
  "/api/oracle(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Public routes - no auth needed
  if (isPublicRoute(req)) return;

  // All routes need Clerk session
  await auth.protect();

  // Oracle routes need additional wallet check
  // The actual role check happens at component level
  // via useIsOracle - middleware handles Clerk session only
  // The contract-level check is the final enforcement
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",           // Landing page — always public
  "/registry(.*)", // Public property search — no login needed
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/properties/token/(.*)", // Public token reads
]);

const isOracleRoute = createRouteMatcher([
  "/oracle(.*)",
  "/api/oracle(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Public routes — skip auth
  if (isPublicRoute(req)) return;

  // All other routes require authentication
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
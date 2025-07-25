import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const publicPages = ["/auth"];
const inPublicPages = createRouteMatcher(publicPages);

console.log("middleware found!");

export default convexAuthNextjsMiddleware(async (req) => {
  const isAuthenticated = await isAuthenticatedNextjs();
  if (!inPublicPages(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/auth");
  }
  if (inPublicPages(req) && isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

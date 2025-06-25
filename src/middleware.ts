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
  if (!inPublicPages(req) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(req, "/auth");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

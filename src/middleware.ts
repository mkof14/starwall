import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/interface",
    "/interface/:path*",
    "/backend",
    "/backend/:path*",
    "/admin/:path*",
  ],
};

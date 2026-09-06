import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

const PATHS = [
  "/",
  "/how-it-works",
  "/interface",
  "/interface/connections",
  "/levels",
  "/technology",
  "/faq",
  "/containers",
  "/containers/detection",
  "/containers/specs",
  "/containers/countermeasures",
  "/containers/tiers",
  "/containers/deployment",
  "/contact",
  "/backend",
  "/login",
  "/tasks",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PATHS.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

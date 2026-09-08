import { redirect } from "next/navigation";
import { deskPaths } from "@/lib/price-book/paths";

export default function LegacyPricingDeskPage() {
  redirect(deskPaths.root);
}

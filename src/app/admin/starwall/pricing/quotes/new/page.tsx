import { redirect } from "next/navigation";
import { deskPaths } from "@/lib/price-book/paths";

export default function LegacyNewQuotePage() {
  redirect(deskPaths.newQuote);
}

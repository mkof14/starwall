import { redirect } from "next/navigation";
import { deskPaths } from "@/lib/price-book/paths";

export default function LegacyPriceBookPage() {
  redirect(deskPaths.book);
}

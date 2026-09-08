import { redirect } from "next/navigation";
import { deskPaths } from "@/lib/price-book/paths";

export default function LegacyQuotePage({ params }: { params: { id: string } }) {
  redirect(deskPaths.quote(params.id));
}

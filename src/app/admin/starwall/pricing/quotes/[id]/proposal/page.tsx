import { redirect } from "next/navigation";
import { deskPaths } from "@/lib/price-book/paths";

export default function LegacyProposalPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(deskPaths.proposal(params.id));
}

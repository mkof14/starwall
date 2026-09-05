import Link from "next/link";

export function ContainersBackLink() {
  return (
    <p>
      <Link
        href="/containers"
        className="text-sm text-grey hover:text-orange"
      >
        ← Back to Containers overview
      </Link>
    </p>
  );
}

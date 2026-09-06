import { spawnSync } from "node:child_process";

function hostedPostgres(url) {
  if (!/^postgres(ql)?:\/\//i.test(url)) return false;
  try {
    const host = new URL(url).hostname;
    return host !== "127.0.0.1" && host !== "localhost" && host !== "::1";
  } catch {
    return false;
  }
}

const url = process.env.DATABASE_URL?.trim() ?? "";
if (!hostedPostgres(url)) {
  console.log(
    "Skipping prisma migrate deploy — DATABASE_URL is not a hosted Postgres URL.",
  );
  process.exit(0);
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);

import { exec } from "child_process";
import dotenv from "dotenv";

const envs = dotenv.config({ path: ".env.production.local" });

if (envs.error) {
  console.error("no .env.prod found");
}

for (const [key, value] of Object.entries(envs.parsed!)) {
  exec(`flyctl secrets set ${key}=${value}`);
}

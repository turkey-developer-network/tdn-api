import { execSync } from "node:child_process";
import { config } from "dotenv";

export default function setup(): void {
    const { parsed } = config({ path: ".env.test" });
    execSync("npx prisma migrate reset --force", {
        stdio: "inherit",
        env: { ...process.env, ...parsed },
    });
}

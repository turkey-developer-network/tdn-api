import { randomInt, createHash } from "crypto";
import type { OtpPort } from "@core/ports/services/otp.port";

export class OtpService implements OtpPort {
    generateOtp(length: number = 8): string {
        const max = Math.pow(10, length);
        const otp = randomInt(0, max).toString();
        return otp.padStart(length, "0");
    }

    hashOtp(otp: string): string {
        return createHash("sha256").update(otp).digest("hex");
    }
}

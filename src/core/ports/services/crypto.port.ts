export interface CryptoPort {
    generateOtp(length?: number): string;
    hashOtp(otp: string): string;
    generateRandomHex(bytes: number): string;
}

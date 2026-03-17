export interface UpdateAvatarUseCaseInput {
    userId: string;
    fileBuffer: Buffer;
    mimeType: string;
    originalFileName: string;
}

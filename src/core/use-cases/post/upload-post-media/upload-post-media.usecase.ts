import type { StoragePort } from "@core/ports/services/storage.port";
import { InvalidMediaTypeError } from "@core/errors";
import type { UploadPostMediaInput } from "./upload-post-media-usecase.input";

/**
 * Use case for uploading post media files.
 *
 * This use case handles the process of uploading media files (images and videos)
 * for posts to the storage service with proper file naming and validation.
 */
export class UploadPostMediaUseCase {
    /**
     * Creates a new instance of UploadPostMediaUseCase.
     *
     * @param storageService - Service for file storage operations
     */
    constructor(private readonly storageService: StoragePort) {}

    /**
     * Executes the media upload process.
     *
     * @param input - Input containing file data, MIME type, original filename, and user ID
     * @returns Promise<string> The uploaded file path/URL
     *
     * @throws InvalidMediaTypeError - When the file type is not supported
     *
     * @remarks
     * This method validates the file type, generates a unique filename with
     * user ID and timestamp, and uploads the file to the storage service.
     * Supported file types are images and videos.
     */
    async execute(input: UploadPostMediaInput): Promise<string> {
        if (
            !input.mimeType.startsWith("image/") &&
            !input.mimeType.startsWith("video/")
        ) {
            throw new InvalidMediaTypeError();
        }

        const extension = input.originalFileName.split(".").pop() || "jpeg";
        const newFileName = `posts/${input.userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

        const uploadedFilePath = await this.storageService.upload(
            newFileName,
            input.fileBuffer,
            input.mimeType,
        );

        return uploadedFilePath;
    }
}

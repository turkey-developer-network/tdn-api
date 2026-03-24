/**
 * Input interface for updating a user's profile banner.
 *
 * This interface defines the required parameters for uploading
 * and updating a user's profile banner image.
 */
export interface UpdateBannerUseCaseInput {
    /**
     * The unique identifier of the user whose banner is being updated.
     */
    userId: string;

    /**
     * The MIME type of the image file (e.g., "image/jpeg", "image/png").
     * Used for validation and proper handling of the file.
     */
    mimeType: string;

    /**
     * The original filename of the uploaded image file.
     * Used for generating the storage filename and extension detection.
     */
    originalFileName: string;

    /**
     * The binary content of the image file to be uploaded as the new banner.
     */
    fileBuffer: Buffer;
}

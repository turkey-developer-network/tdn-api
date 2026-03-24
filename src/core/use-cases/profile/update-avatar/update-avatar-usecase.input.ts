/**
 * Input interface for updating a user's profile avatar.
 *
 * This interface defines the required parameters for uploading
 * and updating a user's profile picture.
 */
export interface UpdateAvatarUseCaseInput {
    /**
     * The unique identifier of the user whose avatar is being updated.
     */
    userId: string;

    /**
     * The binary content of the image file to be uploaded as the new avatar.
     */
    fileBuffer: Buffer;

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
}

/**
 * Input interface for uploading post media files.
 *
 * This interface defines the required parameters for uploading media files
 * (images or videos) associated with posts.
 */
export interface UploadPostMediaInput {
    /**
     * The unique identifier of the user uploading the media.
     */
    userId: string;

    /**
     * The binary content of the file to be uploaded.
     */
    fileBuffer: Buffer;

    /**
     * The MIME type of the file (e.g., "image/jpeg", "video/mp4").
     * Used for validation and proper handling of the file.
     */
    mimeType: string;

    /**
     * The original filename of the uploaded file.
     * Used for generating the storage filename and extension detection.
     */
    originalFileName: string;
}

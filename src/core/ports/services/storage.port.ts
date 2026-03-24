/**
 * Port interface for file storage operations.
 * Following Clean Architecture principles, this interface defines the contract
 * for storage operations without exposing implementation details.
 */
export interface StoragePort {
    /**
     * Uploads a file to the storage system.
     * @param fileName - The name of the file.
     * @param fileBuffer - The file content as a Buffer.
     * @param mimeType - The MIME type of the file.
     * @returns The storage URL/path of the uploaded file.
     */
    upload(
        fileName: string,
        fileBuffer: Buffer,
        mimeType: string,
    ): Promise<string>;

    /**
     * Deletes a file from the storage system.
     * @param fileName - The name of the file to delete.
     */
    delete(fileName: string): Promise<void>;
}

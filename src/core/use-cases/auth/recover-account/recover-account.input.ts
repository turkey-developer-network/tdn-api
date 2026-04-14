/**
 * Input data transfer object for the RecoverAccount use case
 */
export interface RecoverAccountInput {
    /**
     * The token used to recover the account
     */
    recoveryToken: string;
}

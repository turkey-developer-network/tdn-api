/**
 * Input data transfer object for the CheckUser use case
 */
export interface CheckUserUseCaseInput {
    /**
     * The identifier used to look up the user (e.g. username or email)
     */
    identifier: string;
}

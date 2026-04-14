/**
 * Output DTO for the FollowUserUseCase.
 * This interface defines the structure of the data returned after executing the follow user use case.
 * It includes the updated count of followers for the target user.
 */
export interface FollowUserUseCaseOutput {
    /**
     * The updated count of followers for the target user after the follow operation is completed.
     */
    followersCount: number;
}

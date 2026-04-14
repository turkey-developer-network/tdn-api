/**
 * @description
 * This interface defines the input for the FollowUserUseCase. It includes the current user's ID and the target user's ID that they want to follow.
 */
export interface FollowUserUseCaseInput {
    /**
     * The ID of the user initiating the follow action.
     */
    currentUserId: string;
    /**
     * The ID of the user to be followed. This should not be the same as currentUserId, as users cannot follow themselves.
     */
    targetId: string;
}

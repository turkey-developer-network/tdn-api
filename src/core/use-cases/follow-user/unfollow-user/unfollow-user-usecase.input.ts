/**
 * This interface defines the input structure for the UnFollowUserUseCase. It includes the necessary information required to perform the unfollow action, such as the ID of the current user and the ID of the target user to be unfollowed.
 */
export interface UnFollowUserUseCaseInput {
    /**
     * The ID of the user initiating the unfollow action. This is typically the currently authenticated user who wants to unfollow another user.
     */
    currentUserId: string;
    /**
     * The ID of the user to be unfollowed. This is the target user that the current user wants to stop following. The use case will check if this user exists and if the current user is currently following them before proceeding with the unfollow action.
     */
    targetId: string;
}

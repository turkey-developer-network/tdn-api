/**
 * This module serves as the entry point for the Unfollow User use case, providing a centralized location to export all related components such as input and output interfaces, and the use case implementation itself. By consolidating these exports, it promotes better organization and easier imports in other parts of the application that need to utilize the unfollow user functionality.
 */
export { UnFollowUserUseCaseInput } from "./unfollow-user-usecase.input";
/**
 * Exports the UnFollowUserUseCaseOutput interface, which defines the structure of the data returned after executing the UnfollowUserUseCase. This includes information about the updated followers count for the target user after the unfollow action has been performed.
 */
export { UnFollowUserUseCaseOutput } from "./unfollow-user-usecase.output";
/**
 * Exports the UnfollowUserUseCase class, which implements the logic to perform the unfollow action between two users. The use case takes the current user's ID and the target user's ID as input, checks if the target user exists and if the current user is following them, and then proceeds to unfollow if applicable. Finally, it returns the updated followers count for the target user.
 */
export { UnfollowUserUseCase } from "./unfollow-user.usecase";

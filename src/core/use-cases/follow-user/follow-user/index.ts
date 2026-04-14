/**
 * This module exports the input, output, and use case for following a user.
 */
export { FollowUserUseCaseInput } from "./follow-user-usecase.input";
/**
 * This module exports the FollowUserUseCase, which handles the logic for a user to follow another user. It checks if the user is trying to follow themselves, creates a follow relationship if they are not already following the target user, sends a notification to the target user, and emits a real-time event to notify them of the new follower.
 */
export { FollowUserUseCaseOutput } from "./follow-user-usecase.output";
/**
 * This module exports the FollowUserUseCase, which is responsible for executing the logic of following a user. It takes the current user's ID and the target user's ID as input, checks if the follow action is valid, and performs the necessary operations to establish the follow relationship, send notifications, and emit real-time events.
 */
export { FollowUserUseCase } from "./follow-user.usecase";

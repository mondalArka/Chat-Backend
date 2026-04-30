import { Provider } from "@nestjs/common";
import { UserRepo, SessionRepo, MessageRepo, MediaRepo, ChatRepo, ParticipantRepo } from "src/repositories/index.repositories";

let repoMappers = new Map<string, Provider>(
    [
        ["USER_REPOSITORY", UserRepo],
        ["SESSION_REPOSITORY", SessionRepo],
        ["MESSAGE_REPOSITORY", MessageRepo],
        ["MEDIA_REPOSITORY", MediaRepo],
        ["CHAT_REPOSITORY", ChatRepo],
        ["PARTICIPANT_REPOSITORY", ParticipantRepo]
    ]
)

export const setRepoMappers = (token: string, provider: Provider) => {
    repoMappers.set(token, provider);
}

export const getRepoMappers = (tokens: string[]) => {
    return tokens.map(token => repoMappers.get(token)).filter((p): p is Provider => p !== undefined);
}
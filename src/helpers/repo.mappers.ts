import { Provider } from "@nestjs/common";
import { UserRepo, SessionRepo } from "src/repositories/index.repositories";

let repoMappers = new Map<string, Provider>(
    [
        ["USER_REPOSITORY", UserRepo],
        ["SESSION_REPOSITORY", SessionRepo]
    ]
)

export const setRepoMappers = (token: string, provider: Provider) => {
    repoMappers.set(token, provider);
}

export const getRepoMappers = (tokens: string[]) => {
    return tokens.map(token => repoMappers.get(token)).filter((p): p is Provider => p !== undefined);
}
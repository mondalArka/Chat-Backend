import { Module, Provider } from "@nestjs/common";
import { SessionRepo, UserRepo } from "./index.repositories";
import { getRepoMappers } from "src/helpers/repo.mappers";


@Module({})
export class RepositoryModule {
    static forFeature(tokens: string[]) {
        const providers = getRepoMappers(tokens);
        return {
            module: RepositoryModule,
            exports: providers,
            providers
        };
    }
}
import { User } from "src/entities/User.entity";
import { DataSource, Repository } from "typeorm";
import { UserRepository } from "./user.repository";
import { IndexRepository } from "src/interfaces.enums/repo.interfaces";
import { SessionRepository } from "./session.repositories";
import { Sessions } from "src/entities/Otp.entity";

const createRepo: IndexRepository["createRepo"] = (baseRepo, entityRepo) => {
    Object.setPrototypeOf(baseRepo, entityRepo);
    return baseRepo;
}

export const UserRepo = {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        return createRepo(dataSource.getRepository(User), UserRepository.prototype);
    },
    inject: [DataSource]
}

export const SessionRepo = {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        return createRepo(dataSource.getRepository(Sessions), SessionRepository.prototype);
    },
    inject: [DataSource]
}
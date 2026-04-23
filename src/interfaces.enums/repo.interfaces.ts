import { Repository, ObjectLiteral } from "typeorm";

export interface IndexRepository {
    createRepo: <T extends ObjectLiteral>(
        baseRepo: Repository<T>,
        entityRepo: object
    ) => Repository<T>;
}
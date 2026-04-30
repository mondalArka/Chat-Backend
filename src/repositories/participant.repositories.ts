import { Participant } from "src/entities/Participant.entity";
import { InsertResult, Repository } from "typeorm";

export class ParticipantRepository extends Repository<Participant> {

    async saveParticipants(body: Partial<Participant>): Promise<Participant> {
        const obj = this.create(body);
        return await this.save(obj);
    }

    async insertParticipant(body: Array<Partial<Participant>>): Promise<InsertResult> {
        return this.insert(body);
    }
}
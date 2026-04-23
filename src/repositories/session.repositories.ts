import { Repository } from "typeorm";
import { Sessions } from "src/entities/Otp.entity";
export class SessionRepository extends Repository<Sessions> {

    async saveSession(session: Partial<Sessions>): Promise<Sessions> {
        const sessionObject = this.create(session);
        return await this.manager.save(sessionObject);
    }

    async findBySessionId(sessionId: string): Promise<Sessions | null> {
        return await this.findOne({ where: { sessionId } });
    }

    async findByEmail(email: string): Promise<Sessions | null> {
        return await this.findOne({ where: { email } });
    }

    async deleteBySessionId(sessionId: string): Promise<void> {
        await this.delete({ sessionId });
    }
} 
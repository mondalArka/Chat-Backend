import { Repository } from "typeorm";
import { User } from "src/entities/User.entity";
export class UserRepository extends Repository<User> {

    async saveUser(user: Partial<User>): Promise<User> {
        const userObject = this.create(user);
        return await this.manager.save(userObject);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ where: { email } });
    }
} 
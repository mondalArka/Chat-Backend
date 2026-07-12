import { User } from "src/entities/User.entity";
import { DataSource } from "typeorm";
import { UserRepository } from "./user.repository";
import { IndexRepository } from "src/interfaces.enums/repo.interfaces";
import { SessionRepository } from "./session.repositories";
import { Sessions } from "src/entities/Otp.entity";
import { MessageRepository } from "./message.repositories";
import { Message } from "src/entities/Message.entity";
import { ChatRepository } from "./chat.reposiotries";
import { Chat } from "src/entities/Chat.entity";
import { setRepoMappers } from "src/helpers/repo.mappers";
import { Participant } from "src/entities/Participant.entity";
import { ParticipantRepository } from "./participant.repositories";
import { Provider } from "@nestjs/common";
import { Media } from "src/entities/Media.entity";
import { MediaRepository } from "./media.repositories";
import dataSource from "src/config/data-source";
import { NotificationRepository } from "./notification.repositories";
import { UserNotification } from "src/entities/Notification.entity";

const createRepo: IndexRepository["createRepo"] = (baseRepo, entityRepo) => {
    Object.setPrototypeOf(baseRepo, entityRepo);
    return baseRepo;
}

export const UserRepo = {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(User), UserRepository.prototype);
        setRepoMappers("USER_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}

export const NotificationRepo = {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(UserNotification), NotificationRepository.prototype);
        return repo;
    },
    inject: [DataSource]
}

export const SessionRepo = {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(Sessions), SessionRepository.prototype);
        setRepoMappers("SESSION_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}

export const MessageRepo = {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(Message), MessageRepository.prototype);
        setRepoMappers("MESSAGE_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}

export const MediaRepo = {
    provide: "MEDIA_REPOSITORY",
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(Media), MediaRepository.prototype);
        setRepoMappers("MEDIA_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}

export const ChatRepo = {
    provide: "CHAT_REPOSITORY",
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(Chat), ChatRepository.prototype);
        setRepoMappers("CHAT_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}

export const ParticipantRepo = {
    provide: "PARTICIPANT_REPOSITORY",
    useFactory: (dataSource: DataSource) => {
        const repo = createRepo(dataSource.getRepository(Participant), ParticipantRepository.prototype);
        setRepoMappers("PARTICIPANT_REPOSITORY", repo as unknown as Provider);
        return repo;
    },
    inject: [DataSource]
}
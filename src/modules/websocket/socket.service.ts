import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RedisProvider } from "../redis/redis.provider";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";
import { Inject } from "@nestjs/common";
import { UserRepository } from "src/repositories/user.repository";
import { ChatRepository } from "src/repositories/chat.reposiotries";
import { ParticipantRepository } from "src/repositories/participant.repositories";

@WebSocketGateway({
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})
export class SocketGateway {
    constructor(
        private readonly redisService: RedisProvider,
        private readonly jwtService: JwtService,
        @Inject("USER_REPOSITORY")
        private readonly userRepo: UserRepository,
        @Inject("PARTICIPANT_REPOSITORY")
        private readonly participantRepo: ParticipantRepository
    ) { }
    @WebSocketServer()
    server: Server;

    async handleConnection(socket: Socket) {
        const cookieHeader = socket.handshake.headers?.cookie;
        if (!cookieHeader) return socket.disconnect();

        const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
                const [key, ...val] = c.trim().split('=');
                return [key, val.join('=')];
            })
        );
        const sessionId = cookies['sessionId'];
        if (!sessionId) return socket.disconnect();

        let redis = this.redisService.getRedisClient();
        const session = await redis.get(`session:${sessionId}`);

        if (!session)
            return socket.disconnect();

        const parsed = JSON.parse(session);

        if (!parsed?.refreshToken)
            return socket.disconnect();

        let decode: any;
        try {
            decode = this.jwtService.verify(parsed.refreshToken, { secret: process.env.JWT_SECRET });
        } catch (e) {
            console.error(e);
            return socket.disconnect();
        }

        const user = await this.userRepo.findOneBy({
            id: decode?.id
        });

        if (!user)
            return socket.disconnect();

        const particpant = await this.participantRepo.find(
            {
                where: { userId: user.id },
                relations: ["chat"]
            }
        );

        particpant.forEach(participant => {
            socket.join(participant.chat.id);
        });
        console.log("Connected to rooms");
    }

    handleDisconnect(socket: Socket) {
        console.log("Socket disconnected:", socket.id);
    }

    sendMessage(data: {
        id: string,
        type: string,
        message: string,
        chatId: string,
        sender: object,
        medias: object,
        replyToMessage?: object | null,
        isRead: boolean,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
        unreadCount?: number
    }) {
        console.log("Message sent:", data);
        this.server.to(data.chatId).emit("receive-message", data);
    }
}
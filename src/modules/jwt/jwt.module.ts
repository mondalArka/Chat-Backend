import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({})
export class JWTModule {
    static forRoot() {
        return {
            module: JWTModule,
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: (config: ConfigService) => {
                        return {
                            secret: config.get<string>("JWT_SECRET"),
                            signOptions: { expiresIn: '1h' }
                        }
                    },
                    inject: [ConfigService],
                })
            ],
            exports: [JwtModule]
        }
    }
}
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SharedService } from "./shared.service";

@Global()
@Module({
    imports: [
        ConfigModule,
    ],
    providers: [SharedService],
    exports: [
        SharedService,
    ]
})
export class SharedModule { }
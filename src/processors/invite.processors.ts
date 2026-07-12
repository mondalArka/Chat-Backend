import { Processor, WorkerHost } from "@nestjs/bullmq";
import { SharedService } from "src/modules/shared/shared.service";

@Processor("invite-queue")
export class InviteProcessor extends WorkerHost {
    constructor(
        private readonly sharedService: SharedService
    ) {
        super();
        this.sharedService = sharedService;
    }

    async process(job: any) {
        try {
            await this.sharedService.sendMail(
                job.data.toMail,
                job.data.fromMail,
                job.data
            );
            console.log("Invite Mail sent");
        }
        catch (err) {
            console.log(err);
        }
    }
}
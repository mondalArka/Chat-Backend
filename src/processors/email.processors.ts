import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { SharedService } from 'src/modules/shared/shared.service';

@Processor("email-queue")
export class EmailProcessor extends WorkerHost {

    constructor(
        private readonly sharedService: SharedService
    ) {
        super();
    }
    async process(job: any) {
        await this.sharedService.sendMail(
            job.data.toMail,
            job.data.fromMail,
            job.data
        );
        console.log("Mail sent");
    }
}
import { EventSubscriber } from "typeorm";

@EventSubscriber()
export class TimezoneSubscriber {

    async afterConnect(event: { connection: any }) {
        await event.connection.query("SET time_zone = '+05:30'");
    }
}
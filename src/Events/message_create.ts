import { Client } from "discord.js";
import { Sequelize } from "sequelize";
import { capture } from "../capture/capture_message";
import { listen_for_commands } from "../commands";

export const message_create_listener = (client: Client, sequelize: Sequelize) => {
    client.on('messageCreate', async (msg) => {
        capture(msg, sequelize);
        listen_for_commands(msg, sequelize);
    })
}
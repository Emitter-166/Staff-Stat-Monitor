import { Client, IntentsBitField} from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { Sequelize } from 'sequelize';
import { message_create_listener } from './Events/message_create';

require('dotenv').config({
    path: path.join(__dirname, ".env")
})


export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'stats.db',
    logging: false
})


const path_to_models = path.join(__dirname, 'database', 'models');

fs.readdirSync(path_to_models)
    .forEach(modelFile => {
        const model = require(path.join(path_to_models, modelFile));
        model.model(sequelize);
    })




sequelize.sync({alter: true}).then(sequelize => {
    client.login(process.env._TOKEN);
})


const F = IntentsBitField.Flags;
const client = new Client({
    intents: [F.Guilds, F.GuildMessages, F.GuildMembers, F.MessageContent]
})


client.once('ready', (client) => {
    message_create_listener(client, sequelize);
    console.log("ready");
})



/*
commands:
    - !stats @user <days> 
    - !stats role <days>
 * 
 * 
 */







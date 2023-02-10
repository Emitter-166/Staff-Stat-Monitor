import {
    Message
} from "discord.js";
import {
    Sequelize
} from "sequelize";

export const capture = async (msg: Message, sequelize: Sequelize) => {
    if (msg.author.bot) return;
    if (!msg.guild) return;

    const userId = msg.author.id;
    const date = getDate();

    sequelize.transaction(async t => {

        let model = await sequelize.model('stats').findOne({
            where: {
                userId: userId,
                date: date
            },
            transaction: t
        })

        if(model === null){
            await sequelize.model('stats').create({
                userId: userId,
                date: date,
                msg: 1
            }, {transaction: t})
            return;
        }

        await model.increment('msg', {
            by: 1,
            transaction: t
        })

    }).catch(err => console.log(err));


    /* 
    step 1: find or create the model of that user for that date
    step 2: increment it by 1
    */
}


const getDate = (): string => {
    return (new Date()).toDateString();
}
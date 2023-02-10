import {
    EmbedBuilder,
    GuildMember,
    Message,
    PermissionsBitField
} from "discord.js";
import {
    Sequelize
} from "sequelize";

export const listen_for_commands = async (msg: Message, sequelize: Sequelize) => {
    if (!msg.content.startsWith('!')) return;
    if (!msg.member?.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return;
    if (msg.author.bot) return;
    if (!msg.guild) return;


    const args = msg.content.split(" ");
    const commandName = args[0];
    const loading = new EmbedBuilder();
    loading.setTitle("<a:loading:1073540546393538570> Loading...")

    let toEdit: Message; 

    switch (commandName) {
        case "!stats":

            const embed = new EmbedBuilder();

            const id = args[2].replace(/[<&@>]/g, "");
            const days = Number(args[3]);

            toEdit = await msg.reply({embeds: [loading], allowedMentions: {repliedUser: false}});
            if (args[1] === 'user') {

                if (Number.isNaN(days)) return;
                if (Number.isNaN(Number(id))) return;


                try {
                    let member = await msg.guild.members.fetch(id)
                    embed.setTitle(`stats for ${member.user.username}#${member.user.discriminator}`);
                    embed.setDescription('```markdown\n' + `messages in the last ${days} days: ${await getStats(id, days, sequelize)}` + "```")
                } catch (err) {
                    console.log(err);
                    const msg = "unknown user";
                    embed.setDescription("```markdown\n" + msg + "```")
                }


            } else if (args[1] === 'role') {
                try {
                    let role = await msg.guild.roles.fetch(id)
                    if (role === null) throw new Error("couldn't find role");
                    const members = (await msg.guild.members.fetch()).filter(member => member.roles.cache.has(id));

                    let all = [];

                    for (let member of members) {
                      
                            const stats = await getStats(member[0], days, sequelize);
                            if (stats !== 0) {
                                all.push([member[0], stats]);
                            }

                    }
                    all = all.sort((a, b) => b[1] as number - (a[1] as number)).slice(0, 100);

                    const result = all.reduce((acc, curr, index) => {
                        return acc + `${index + 1}. <@${curr[0]}>: **${curr[1]}**\n`;
                    }, "");

                    embed.setTitle(`@${role.name} stats`)
                    embed.setDescription(result);
                } catch (err) {
                    console.log(err);

                    const msg = "unknown role";
                    embed.setDescription("```markdown\n" + msg + "```")
                }
            } else {
                const err = "usage: !stats role/user id days";
                embed.setDescription("```markdown\n" + err + "```")
            }

            toEdit.edit({
                embeds: [embed],
                allowedMentions: {
                    repliedUser: false
                }
            });
    }
}

const getStats = async (userId: string, days: number, sequelize: Sequelize): Promise < number > => {
    let count = 0;

    const stats = sequelize.model('stats');

    for (let i = 0; i < days; i++) {
        const model = await stats.findOne({
            where: {
                userId: userId,
                date: getDate(i)
            }
        })

        if (model !== null) {
            count += model.get('msg') as number;
        }
    }

    return count;
}

const getDate = (days_ago: number): string => {
    return (new Date(Date.now() - (days_ago * 86_400_000))).toDateString();
}
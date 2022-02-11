const fs = require("fs");
const Filer = require("../../utils/filer");
module.exports = async function(client) {
    Filer(`${ROOT.path}/src/commands/slashCommands`, async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const cmd = require(file);
            if (cmd.ignoreFile) return;
            client.commands.slashCommands.set(cmd.name, cmd);
        })
        let promise = Promise.resolve()
        res.forEach(async function(file) {
            promise = promise.then(async function() {
                const interval = 5000;
                if (fs.statSync(file).isDirectory()) return;
                const cmd = require(file);
                if (cmd.ignoreFile) return;
                
                if (cmd.guilds && Array.isArray(cmd.guilds)) cmd.guilds.forEach(guildID => {
                    (async () => {
                    const guild = client.guilds.cache.get(guildID) ?? await client.guilds.fetch(guildID)
                    const verifier = guild.commands.cache.find(x => x.name == cmd.name)
                    if (verifier) await guild.commands.edit(verifier.id, {
                        name: cmd.name,
                        description: cmd.description ?? "None",
                        options: cmd.options ?? [],
                        type: cmd.type ?? "CHAT_INPUT"
                    })
                    else await guild.commands.create({
                        name: cmd.name,
                        description: cmd.description ?? "None",
                        options: cmd.options ?? [],
                        type: cmd.type ?? "CHAT_INPUT"
                    })
                })()
            })
                else {
                    const verifier = client.application.commands.cache.find(x => x.name == cmd.name)
                    if (verifier) await client.application.commands.edit(verifier.id, {
                        name: cmd.name,
                        description: cmd.description ?? "None.",
                        options: cmd.options ?? [],
                        type: cmd.type ?? "CHAT_INPUT"
                    })
                    else await client.application.commands.create({
                        name: cmd.name,
                        description: cmd.description ?? "None.",
                        options: cmd.options ?? [],
                        type: cmd.type ?? "CHAT_INPUT"
                    })
                }

                return new Promise(function(resolve) {
                    setTimeout(resolve, interval);
                })
            })
        })
    })
}
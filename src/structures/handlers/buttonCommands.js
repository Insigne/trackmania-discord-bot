const fs = require("fs");
const Filer = require("../../utils/filer");
module.exports = async function(client) {
    Filer(`${ROOT.path}/src/commands/buttonCommands`, async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const button = require(file)
            if (button.ignoreFile) return;
            client.commands.buttonCommands.set(button.name, button)
        })
    })
}
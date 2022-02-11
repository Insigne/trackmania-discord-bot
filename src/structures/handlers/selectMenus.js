const fs = require("fs");
const Filer = require("../../utils/filer");
module.exports = async function(client) {
    Filer(`${ROOT.path}/src/commands/selectMenus`, async function(err, res) {
        res.forEach(file => {
            if (fs.statSync(file).isDirectory()) return;
            const selectMenu = require(file)
            if (selectMenu.ignoreFile) return;
            client.commands.selectMenus.set(selectMenu.name, selectMenu)
        })
    })
}
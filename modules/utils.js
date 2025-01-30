const messages = require("../lang/en/en");
const fs = require("fs");

class Greeter {
    constructor(name){
        this.name = name;
    }

    #getDate() {
        return new Date()
    }

    getGreeting() {
        const fullMessage = messages.strings.msg.replace("%1", this.name);
        const html = `<h3 style="color:blue">${fullMessage} ${this.#getDate()}</h3>`;
        return html
    }
}
class FileEditor {
    constructor(file){
        this.file = file;
    }

    writeToFile(text){
        try {
            fs.appendFileSync(this.file, text);
            return `<p>${messages.strings.successWritingFile}</p>`;
        } catch(err) {
            return `<h2>${messages.strings.errWritingFile}</h2>`;
        }
    }

    readFromFile(fileName){
        if(fileName){
            try {
                const data = fs.readFileSync(fileName);
                return `<p>${data}</p>`;
            } catch(err) {
                return `<h2>${messages.strings.errFile404.replace("%1", fileName)}</h2>`;
            }
        }
        
        return `<h2>${messages.strings.errNoFileGiven}</h2>`
    }
}

module.exports = {
    Greeter,
    FileEditor
}
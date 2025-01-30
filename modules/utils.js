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
        const html = `<p color="blue">${fullMessage} ${this.#getDate()}</p>`;
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
            return `<p>${messages.strings.errWritingFile}</p>`;
        }
    }

    readFromFile(fileName){
        if(fileName){
            try {
                const data = fs.readFileSync(fileName);
                return `<p>${data}</p>`;
            } catch(err) {
                return `<p>${messages.strings.errFile404.replace("%1", fileName)}</p>`;
            }
        }
        
        return `<p>${messages.strings.errNoFileGiven}</p>`
    }
}

module.exports = {
    Greeter,
    FileEditor
}
const messages = require("./lang/en/en");
const {Greeter, FileEditor} = require("./modules/utils");

const http = require("http");
const url = require("url");

const fileName = "file.txt";

const lab3Pages = {
    "datePage" : "getDate",
    "writePage": "writeFile",
    "readPage" : "readFile",
    "param" : "3"
}

http.createServer((req, res) => {
    const urlParams = req.url.split("/");
    if (urlParams[1] == "favicon.ico") {
        res.writeHead(204).end();
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    if(urlParams[1] == lab3Pages.param){
        const editor = new FileEditor(fileName);
        switch (urlParams[2]) {
            case lab3Pages.datePage:
                const name = url.parse(req.url, true).query.name;
                const greeter = new Greeter(name);
                res.write(greeter.getGreeting());
                break;
            case lab3Pages.writePage:
                const text = url.parse(req.url, true).query.text;
                res.write(editor.writeToFile(text));
                break;
            case lab3Pages.readPage:
                const file = urlParams[2];
                res.write(editor.readFromFile(file));
                break;
            default:
                const page404 = `<h2 style="color:red">${messages.strings.page404}</h2>`;
                res.write(page404);
        }
    } else {
        const page404 = `<h2 style="color:red">${messages.strings.page404}</h2>`;
        res.write(page404);
    }
    
    res.end();



}).listen(8000);
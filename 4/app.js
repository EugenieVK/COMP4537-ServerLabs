const messages = require("./lang/en/en");
const http = require("http");
const url = require("url");

class DictionaryServer {
    constructor(port) {
        this.port = port;
        this.dictionary = [];
        this.lastUpdated = "NO UPDATES";
        this.requestCount = 0;
    }

    addDefinition(word, def) {
        const check = this.dictionary.filter((def) => {
            return Object.keys(def)[0] == word;
        });

        if (check.length > 0) {
            return false;
        } else {
            const newDef = JSON.parse(`{"${word}" : "${def}"}`);
            this.dictionary.push(newDef);
            this.lastUpdated = this.getDate();
            return true;
        }
    }

    getDefinition(word) {
        const foundWords = this.dictionary.filter((def) => {
            return Object.keys(def)[0] == word;
        });

        if (foundWords.length > 0) {
            return foundWords[0][word];
        } else {
            return null;
        }
    }

    getDate() {
        return new Date().toISOString().split('T')[0]
    }

    handleRequest(req, res) {
        this.requestCount++;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => {
                body += chunk;
            });

            req.on('end', () => {
                this.handlePost(body, res)
                
            res.end();
            });
        } else if (req.method === "GET") {
            const word = url.parse(req.url, true).query.word;
            this.handleGet(word, res);
            
            res.end();
        } else {
            res.writeHead(501);
            const serverRes = JSON.stringify({
                    "message": messages.messages.BadRequest,
                    "requestNumber": this.requestCount
            });
            res.write(serverRes);
            
            res.end();
        }
    }

    handleGet(word, res){
        let serverRes = "";
        if(word){
            const def = this.getDefinition(word);
            if(def){
                serverRes = JSON.stringify({
                    "definition": def,
                    "requestNumber": this.requestCount
                });
                res.writeHead(200);

            } else {
                serverRes = JSON.stringify({
                    "message": messages.messages.WordNotFound,
                    "requestNumber": this.requestCount
                });
                res.writeHead(404);
            }
        } else {
            serverRes = JSON.stringify({
                "message": messages.messages.BadRequest,
                "requestNumber": this.requestCount
            });
            res.writeHead(400);
        }

        res.write(serverRes);
    }

    handlePost(body, res) {
        const jsonBody = JSON.parse(body);
        const word = jsonBody["word"];
        const def = jsonBody["definition"];

        let serverRes = "";
        if (word && def) {
            const didAdd = this.addDefinition(word, def);
            if (didAdd){
                serverRes = JSON.stringify({
                    "message": messages.messages.NewEntry + `${word} : ${def}`,
                    "requestNumber": this.requestCount,
                    "updatedOn": this.lastUpdated,
                    "totalNumberOfWords": this.dictionary.length
                });
                res.writeHead(200);
            } else {
                serverRes = JSON.stringify({
                    "message": messages.messages.DuplicateWordWarning,
                    "requestNumber": this.requestCount
                });
                res.writeHead(400);
            }
        } else {
            serverRes = JSON.stringify({
                "message": messages.messages.BadRequest,
                "requestNumber": this.requestCount
            });
            res.writeHead(400);
        }

        res.write(serverRes);
    }

    startServer() {
        http.createServer((req, res) => {
            this.handleRequest(req, res);
        }).listen(this.port, ()=>{
            console.log(`Server is running at port ${this.port}`);
        });
    }
}

const server = new DictionaryServer(8000);
server.startServer();


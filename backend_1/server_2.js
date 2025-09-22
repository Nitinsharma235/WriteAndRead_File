const fs = require("fs");
const WebSocket = require("ws");
const url = require("url");
const readline = require("readline");
const getLastLines = require('./getLastLines');

const wss = new WebSocket.Server({ port: 3030 });
console.log("Server 2 running at ws://localhost:3030");

wss.on("connection", (ws, req) => {
  const parsedUrl = url.parse(req.url, true);
  // console.log("purl", parsedUrl);
  const { readfromstart, readfromend, lines } = parsedUrl.query;
  const linecount = parseInt(lines, 10) || 10;

  console.log("client connected to Server 2");

  let fileData = [];
  const file = "server_one_Data.txt";

  if (fs.existsSync(file)) {
    fileData = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
  }
  const fileStream = fs.createReadStream(file);

  if (readfromstart) {
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let currentLine = 0;
    let selectedLines = [];

    rl.on("line", (line) => {
      currentLine++;
      if (currentLine <= linecount) {
        selectedLines.push(line);
      }
      if (currentLine >= linecount) {
        ws.send(JSON.stringify({ type: "init", data: selectedLines }));
        rl.close();
      }
    });

    // console.log("selline", selectedLines);
  } else if (readfromend) {
    getLastLines(file, linecount, (err, lastLines) => {
      if (err) {
        ws.send(JSON.stringify({ type: "error", data: err.message }));
      } else {
        ws.send(JSON.stringify({ type: "init", data: lastLines }));
      }
    });
  } else {
    ws.send(JSON.stringify("Invalid params"));
  }

  let lastSize = fs.existsSync(file) ? fs.statSync(file).size : 0;

  fs.watch(file, (event) => {
    if (event === "change") {
      fs.stat(file, (err, stats) => {
        if (err) return;

        if (stats.size > lastSize) {
          const stream = fs.createReadStream(file, {
            start: lastSize,
            end: stats.size,
          });

          stream.on("data", (chunk) => {
            const newLines = chunk.toString().trim().split("\n");
            newLines.forEach((line) => {
              ws.send(
                JSON.stringify({
                  type: "update",
                  data: line,
                })
              );
            });
          });

          lastSize = stats.size;
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected from Server 2");
  });
});

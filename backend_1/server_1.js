const fs = require("fs");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 2020 });

console.log("web server running at ws://localhost:2020");

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    const data = raw.toString();
    // console.log("data", data);

    fs.writeFile("server_one_Data.txt", data + "\n" , { flag: "a" }, (err) => {
      if (err) {
        console.error("error:", err);
        ws.send(
          JSON.stringify({ status: "error", message: "Failed to save data" })
        );
      } else {
        ws.send(JSON.stringify({ status: "success", saved: data }));
      }
    });
  });
});

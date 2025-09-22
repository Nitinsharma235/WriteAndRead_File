const fs = require("fs");


function getLastLines(filePath, lineCount, callback) {
  fs.stat(filePath, (err, stats) => {
    if (err) return callback(err);

    let fileSize = stats.size;
    let chunkSize = 1024;
    let lines = [];
    let currentPosition = fileSize;

    function readBlock() {
      if (lines.length >= lineCount || currentPosition <= 0) {
        return callback(null, lines.slice(-lineCount));
      }

      const start = Math.max(0, currentPosition - chunkSize);
      const length = currentPosition - start;

      let textBlock = "";
      const reader = fs.createReadStream(filePath, { start, end: currentPosition - 1 });

      reader.on("data", (data) => {
        console.log(`Read chunk: ${data.length} bytes`);
        textBlock = data.toString() + textBlock; 
      });

      reader.on("end", () => {
        const blockLines = textBlock.split(/\r?\n/).filter(line => line !== "");
        lines = blockLines
          .slice(Math.max(0, blockLines.length - (lineCount - lines.length)))
          .concat(lines);

        currentPosition = start;
        if (length < chunkSize && start > 0) chunkSize *= 2;

        readBlock();
      });

      reader.on("error", (err) => callback(err));
    }

    readBlock();
  });
}

module.exports = getLastLines;

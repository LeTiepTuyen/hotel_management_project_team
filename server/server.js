const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const API_URL = "https://6719e9a0acf9aa94f6a84f69.mockapi.io/api/destinations";

function makeRequest(method, path, data, callback) {
  const options = {
    hostname: "6719e9a0acf9aa94f6a84f69.mockapi.io",
    path: "/api/destinations" + (path || ""),
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = https.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      try {
        const parsedBody = JSON.parse(body);
        callback(null, parsedBody);
      } catch (error) {
        callback(error);
      }
    });
  });

  req.on("error", (error) => {
    callback(error);
  });

  if (data) {
    req.write(JSON.stringify(data));
  }
  req.end();
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith("/api/destinations")) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const id = pathname.split("/")[3];
      makeRequest(req.method, id ? `/${id}` : "", body ? JSON.parse(body) : null, (error, data) => {
        if (error) {
          res.writeHead(500);
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        }
      });
    });
  } else {
    // Serve static files
    let filePath = path.join(__dirname, "..", "public", pathname === "/" ? "index.html" : pathname);

    // Handle the detail.html page
    if (pathname.startsWith("/detail.html")) {
      filePath = path.join(__dirname, "..", "public", "detail.html");
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType =
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpg",
        ".gif": "image/gif",
      }[extname] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === "ENOENT") {
          fs.readFile(path.join(__dirname, "..", "public", "404.html"), (error, content) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          });
        } else {
          res.writeHead(500);
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

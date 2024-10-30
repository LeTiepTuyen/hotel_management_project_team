const http = require("http");
const https = require("https");
const fs = require("fs").promises; // Sử dụng promises cho fs
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const API_URL = "https://6719e9a0acf9aa94f6a84f69.mockapi.io/api";

// Hàm thực hiện các request HTTP đến MockAPI sử dụng async/await
async function makeRequest(method, endpoint, data = null) {
  const options = {
    hostname: "6719e9a0acf9aa94f6a84f69.mockapi.io",
    path: `/api${endpoint}`,
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);
          resolve(parsedBody);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => reject(error));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Khởi tạo server HTTP với xử lý API và tệp tĩnh
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith("/api")) {
    // Xử lý các yêu cầu API
    let body = "";
    req.on("data", (chunk) => (body += chunk));

    req.on("end", async () => {
      try {
        const [, , resource, id] = pathname.split("/");
        const endpoint = `/${resource}${id ? `/${id}` : ""}`;
        const requestBody = body ? JSON.parse(body) : null;

        const data = await makeRequest(req.method, endpoint, requestBody);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (error) {
        console.error("API Error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    });
  } else {
    // Phục vụ các file tĩnh từ thư mục `public`
    try {
      const filePath = path.join(__dirname, "../public", pathname === "/" ? "index.html" : pathname);
      const extname = String(path.extname(filePath)).toLowerCase();

      const mimeTypes = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".ico": "image/x-icon",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
        ".ttf": "font/ttf",
        ".eot": "application/vnd.ms-fontobject",
        ".svg": "image/svg+xml",
      };

      const contentType = mimeTypes[extname] || "application/octet-stream";

      const content = await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          const notFoundContent = await fs.readFile(path.join(__dirname, "../public", "404.html"));
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(notFoundContent, "utf-8");
        } catch (readError) {
          res.writeHead(500);
          res.end(`Server Error: ${readError.code}`);
        }
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    }
  }
});

// Lắng nghe trên cổng được chỉ định
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

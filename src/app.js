const fs = require('fs');

const getFileName = function (url) {
  if (url == "/") return "./flower-catalog/index.html";
  return "." + url;
}

const send = function (res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
}

const getDetails = function (path, res) {
  fs.readFile(path, (err, data) => {
    if (err) {
      send(res, "not found", 404);
      return;
    }
    send(res, data, 200);
  })
}

const logRequest = function (req) {
  console.log(req.url, req.method);
}

const app = (req, res) => {
  logRequest(req);
  let path = getFileName(req.url);
  getDetails(path, res);
};

// Export a function that can act as a handler

module.exports = app;

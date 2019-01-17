const fs = require('fs');
const Quick = require('./quick');
const app = new Quick();

const getFileName = function (url) {
  if (url == "/") return "./flower-catalog/index.html";
  return "./flower-catalog" + url;
}

const send = function (res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
}

const getDetails = function (req, res) {
  let path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    if (err) {
      send(res, "not found", 404);
      return;
    }
    send(res, data, 200);
  })
}

const logRequest = function (req, res, next) {
  console.log(req.url, req.method);
  next();
}

app.use(logRequest);
app.use(getDetails);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);

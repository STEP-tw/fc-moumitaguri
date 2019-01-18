const fs = require('fs');
const Quick = require('./quick');
const app = new Quick();
const commentsJson = require('../flower-catalog/comments.json');

const getFileName = function (url) {
  if (url == "/") return "./flower-catalog/index.html";
  return "./flower-catalog" + url;
}
const send = function (res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
}

const readBody = (req, res, next) => {
  let content = "";
  req.on('data', (chunk) => content += chunk);
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split('=');
  const assignKeyValueToArgs = ([key, value]) => args[key] = value;
  text.split('&').map(splitKeyValue).forEach(assignKeyValueToArgs);
  console.log(args);
  return args;
}

const commentsHandler = function (req, res) {
  console.log(req.url);
  const comments = req.body;
  let guestComment = readArgs(comments);
  guestComment.date = new Date().toLocaleDateString();
  guestComment.time = new Date().toLocaleTimeString();
  commentsJson.unshift(JSON.stringify(guestComment));
  let content = JSON.stringify(commentsJson);
  fs.writeFile('./flower-catalog/comments.json', content, (err) => {
    if (err) {
      send(res, "not found", 404);
    }
    guestbookHandler(req, res);
  });
}

const getCommentDetails = function (commentList) {
  return commentList.map(x => {
    x = JSON.parse(x);
    return `<table><tr><td>${x.date}</td> <td>${x.time}</td> <td>${x.name}</td> <td>${x.comment}</td></tr></table>`;
  }).join("");
}

const guestbookHandler = function (req, res) {
  let path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    let commentDetails = getCommentDetails(commentsJson);
    let content = data + commentDetails;
    if (err) {
      send(res, "not found", 404);
    }
    send(res, content, 200);
  });
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

app.use(readBody);
app.use(logRequest);
app.get("/guestbook.html", guestbookHandler);
app.post("/guestbook.html", commentsHandler);
app.use(getDetails);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);

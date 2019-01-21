/**
 * @requires module
 */

const fs = require("fs");
const Quick = require("./quick");
const app = new Quick();
const commentsJson = require("../flower-catalog/comments.json");

/**
 * @function getFileName - gives path for the requested file
 * @param {String} url - requested url
 * @returns {string} - filepath
 */
const getFileName = function(url) {
  if (url == "/") return "./flower-catalog/index.html";
  return "./flower-catalog" + url;
};

/**
 * @function send - sends the response according to the request
 * @param {Object} res - response from the server
 * @param {String} content - response content to provide to the client
 * @param {Number} statusCode - statusCode according to the response type
 */
const send = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

/**
 * @function readBody - reads the content of the request
 * @param {Object} req - request from the client
 * @param {Object} res - response from the server
 * @param {Function} next - next request to serve
 */
const readBody = (req, res, next) => {
  let content = "";
  req.on("data", chunk => (content += chunk));
  req.on("end", () => {
    req.body = content;
    next();
  });
};

/**
 * @function readArgs - reads the arguments and acts as a key-value parser
 * @param {String} text - arguments to parse
 * @returns {Object} - object as key-value pair of name and comment
 */
const readArgs = text => {
  let args = {};
  const splitKeyValue = pair => pair.split("=");
  const assignKeyValueToArgs = ([key, value]) => {
    args[key] = unescape(unescape(value));
  };
  text.split("&").map(splitKeyValue).forEach(assignKeyValueToArgs);
  return args;
};

/**
 * @function commentsHandler - handler fot the comments in the guestbook
 * @param {Object} req - request from the client 
 * @param {Object} res - response from the server
 */
const commentsHandler = function(req, res) {
  console.log(req.url);
  const comments = req.body;
  let guestComment = readArgs(comments);
  guestComment.date = new Date().toLocaleDateString();
  guestComment.time = new Date().toLocaleTimeString();
  commentsJson.unshift(guestComment);
  let content = JSON.stringify(commentsJson);
  fs.writeFile("./flower-catalog/comments.json", content, err => {
    if (err) {
      send(res, "not found", 404);
    }
    guestbookHandler(req, res);
  });
};

/**
 * @function getCommentDetails - converts the comment details into html format 
 * @param {Array} commentList - list of comments of guests
 */
const getCommentDetails = function(commentList) {
  return commentList
    .map(x => {
      return `<table><tr><td>${x.date}</td> <td>${x.time}</td> <td>${
        x.name
      }</td> <td>${x.comment}</td></tr></table>`;
    })
    .join("");
};

/**
 * @function guestbookHandler - handles request for the POST method in the guestbook
 * @param {Object} req - request from the client 
 * @param {Object} res - response from the server
 */

const guestbookHandler = function(req, res) {
  let path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    let commentDetails = getCommentDetails(commentsJson);
    let content = data + commentDetails;
    if (err) {
      send(res, "not found", 404);
    }
    send(res, content, 200);
  });
};

/**
 * @function getDetails - provides the response for the request from the client
 * @param {Object} req - request from the client
 * @param {Object} res - response from the server
 */
const getDetails = function(req, res) {
  let path = getFileName(req.url);
  fs.readFile(path, (err, data) => {
    if (err) {
      send(res, "not found", 404);
      return;
    }
    send(res, data, 200);
  });
};

/**
 * @function logRequest - logs the request method and request url
 * @param {Object} req - any request from the client
 * @param {Object} res - response from the server for the specified request
 * @param {Function} next - function to log the next request
 */
const logRequest = function(req, res, next) {
  console.log(req.url, req.method);
  next();
};

app.use(readBody);
app.use(logRequest);
app.get("/guestbook.html", guestbookHandler);
app.post("/guestbook.html", commentsHandler);
app.use(getDetails);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);

const fs = require("fs");
const { readArgs, send, getFilePath } = require("./appUtil");

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

const renderGuestBook = function(comments, guestbook) {
  const commentsInHtml = comments.getCommentinHtml(guestbook);
  return guestbook.replace("##COMMENTS##", commentsInHtml);
};

const serveGuestBook = function(comments, req, res) {
  fs.readFile("./flower-catalog/guestbook.html", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const renderedGuestBook = renderGuestBook(comments, data);
    send(res, renderedGuestBook, 200);
  });
};

const serveGuestBookForPost = function(comments, req, res) {
  let commentDetails = readArgs(req.body);
  let date = new Date();
  commentDetails.date = date.toGMTString();
  comments.insertComment(commentDetails);
  comments.updateCommentsFile();
  serveGuestBook(comments, req, res);
};

/**
 * @function serveFile - provides the response for the request from the client
 * @param {Object} req - request from the client
 * @param {Object} res - response from the server
 */
const serveFile = function(req, res) {
  let path = getFilePath(req.url);
  fs.readFile(path, (err, data) => {
    if (err) {
      send(res, "not found", 404);
      return;
    }
    send(res, data, 200);
  });
};

const refreshComments = function(comments, req, res) {
  send(res, comments.getCommentinHtml(), 200);
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

module.exports = {
  readBody,
  logRequest,
  serveFile,
  renderGuestBook,
  serveGuestBook,
  serveGuestBookForPost,
  refreshComments
};

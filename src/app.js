/**
 * @requires module
 */

const Quick = require("./quick");
const app = new Quick();
const { Comments, initializeComments } = require("./comments");
const {
  readBody,
  logRequest,
  serveFile,
  serveGuestBook,
  serveGuestBookForPost,
  refreshComments
} = require("./requestHandlers");

const commentDetails = initializeComments("./private/comments.json");
const comments = new Comments(commentDetails);


app.use(readBody);
app.use(logRequest);
app.get("/comments", refreshComments.bind(null, comments));
app.get("/guestbook.html", serveGuestBook.bind(null, comments));
app.post("/guestbook.html", serveGuestBookForPost.bind(null, comments));
app.use(serveFile);

// Export a function that can act as a handler

module.exports = app.handleRequest.bind(app);

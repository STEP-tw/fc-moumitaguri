const fs = require("fs");
const commentsJson = "./private/comments.json";

class Comments {
  constructor(comment) {
    this.comments = comment;
  }

  stringify() {
    return JSON.stringify(this.comments);
  }

  updateCommentsFile() {
    fs.writeFile(commentsJson, this.stringify(), err => {});
  }

  formatComment(commentDetail) {
    return `<p>${commentDetail.date}&nbsp<b><br>${
      commentDetail.name
    }&nbsp </b>${commentDetail.comment}</p>`;
  }

  getCommentinHtml() {
    return this.comments.map(this.formatComment).join("");
  }

  insertComment(comment) {
    return this.comments.unshift(comment);
  }
}

const initializeComments = function(path) {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }
  fs.writeFileSync(path, "[]");
  return JSON.parse(fs.readFileSync(path), "utf-8");
};

module.exports = { Comments, initializeComments };

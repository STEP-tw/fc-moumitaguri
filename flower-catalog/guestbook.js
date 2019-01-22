/**
 * This is the description of the encode function
 * It encodes the names and comments of the guests in the guestbook
 */
const encode = function() {
  let nameBox = document.getElementById("name");
  let commentBox = document.getElementById("comment");
  let hiddenNameBox = document.getElementById("hiddenName");
  let hiddenCommentBox = document.getElementById("hiddenComment");
  hiddenNameBox.value = escape(nameBox.value);
  hiddenCommentBox.value = escape(commentBox.value);
};

/**
 * This is the description of the initialize function
 * This initializes the guestbook page
 */
const initialize = function() {
  const submit = document.getElementById("submit");
  submit.onclick = encode;
};

const fetchComments = function() {
  fetch("/comments")
    .then(function(response) {
      return response.text();
    })
    .then(function(comments) {
      console.log(comments);
      document.getElementById("guestComment").innerHTML = comments;
    });
};

window.onload = initialize;

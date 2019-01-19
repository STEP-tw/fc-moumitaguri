const encode = function() {
  let nameBox = document.getElementById("name");
  let commentBox = document.getElementById("comment");
  let hiddenNameBox = document.getElementById("hiddenName");
  let hiddenCommentBox = document.getElementById("hiddenComment");
  hiddenNameBox.value = escape(nameBox.value);
  hiddenCommentBox.value = escape(commentBox.value);
};

const initialize = function() {
  const submit = document.getElementById("submit");
  submit.onclick = encode;
};

window.onload = initialize;

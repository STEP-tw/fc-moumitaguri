/**
 * @function getFilePath - gives path for the requested file
 * @param {String} url - requested url
 * @returns {string} - filepath
 */
const getFilePath = function(url) {
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
  text
    .split("&")
    .map(splitKeyValue)
    .forEach(assignKeyValueToArgs);
  return args;
};

module.exports = {
  readArgs,
  send,
  getFilePath
};
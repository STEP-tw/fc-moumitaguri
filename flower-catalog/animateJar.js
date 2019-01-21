/**
 * This is the description of hide function
 * @param {element} watteringJar - the element having id "jar"
 */

const hide = function (watteringJar) {
  watteringJar.style.visibility = "hidden";
  const timeout = 1000;
  setTimeout(() => {
    watteringJar.style.visibility = "visible";
  }, timeout);
}

/**
 * This is the desciption of the initialize function for the wattering-jar
 */
const initialize = function () {
  let watteringJar = document.getElementById("jar");
  watteringJar.onclick = hide.bind(null, watteringJar);
}

window.onload = initialize;
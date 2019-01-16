const hide = function (watteringJar) {
  watteringJar.style.visibility = "hidden";
  const timeout = 1000;
  setTimeout(() => {
    watteringJar.style.visibility = "visible";
  }, timeout);
}

const initialize = function () {
  let watteringJar = document.getElementById("jar");
  watteringJar.onclick = hide.bind(null, watteringJar);
}

window.onload = initialize;
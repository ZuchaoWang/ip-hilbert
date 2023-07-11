import {add} from "../src";

function startDemo() {
  // Your code here
  console.log("Window loaded: 1 + 2 = " + add(1, 2));
  document.getElementById("content")!.innerHTML = "Window loaded: 1 + 2 = " + add(1, 2);
}

window.addEventListener("load", startDemo);

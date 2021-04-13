import assignment from "../src/assignment/index";
import login from "../src/assignment/login";
import { parserRequestUrl, $ } from "./ultil";

const Assignment = new assignment();
const Login = new login();

const routes = {
  "/": Login,
  "/games": Assignment,
};

class Error404 {
  render() {
    $(".point").style.visibility = "hidden";
    return `<img src="img/404page.jpg" height="700px">`;
  }
}

const router = async () => {
  const { resource } = parserRequestUrl();
  const parseUrl = resource ? `/${resource}` : "/";
  const page = routes[parseUrl] ? routes[parseUrl] : Error404;
  $("#content").innerHTML = await page.render();
  if (page.afterRender) {
    await page.afterRender();
  }
};

window.addEventListener("DOMContentLoaded", router);
window.addEventListener("hashchange", router);

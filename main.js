import * as cookieHandler from './cookie-handler.js'
import * as tokenHandler from './token-handler.js'
import * as apiHandler from "./api-handler.js"

const clientId = "c51c8fdaa8434884896fee43825e36c0";
const clientSecret = "1b2fde74a4b543abaae0d258ae500ee3";
const params = new URLSearchParams(window.location.search);
let code = params.get("code");
const refreshToken = localStorage.getItem("refreshToken");

if (refreshToken) {
    const accessToken = await tokenHandler.getAccessTokenViaRefreshToken(clientId, clientSecret, refreshToken);
    const profile = await tokenHandler.fetchProfile(accessToken);
    tokenHandler.populateUI(profile);
} else if (code) {
    const refreshToken = await tokenHandler.getRefreshToken(clientId, code);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.replace('/');
}

document.getElementById("logout").onclick = function () {
    localStorage.removeItem("refreshToken");
    window.location.reload();
}

document.getElementById("generate").onclick = function() {
    apiHandler.generateRecommendations();
}

if (!refreshToken) {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.hidden = true;
    })
}

function log(message) {
    document.getElementById("log").innerHTML += `<p>> ${message}</p>`
}

log("test");
log("test2");
log("test3");
import * as cookieHandler from './cookie-handler.js';
import * as tokenHandler from './token-handler.js';
import * as apiHandler from "./api-handler.js";
import {generateRecommendations} from "./api-handler.js";
import moment from 'moment';

const clientId = "c51c8fdaa8434884896fee43825e36c0";
const clientSecret = "1b2fde74a4b543abaae0d258ae500ee3";
const params = new URLSearchParams(window.location.search);
let code = params.get("code");
const refreshToken = localStorage.getItem("refreshToken");

function setNewTimeout(time) {
    setTimeout(
        midnightTask,
        moment(time, "hh:mm:ss").diff(moment(), 'seconds')
    );
    log("set new timer");
}

async function midnightTask() {
    await generateRecommendations(localStorage.getItem("amount"));
    log("auto-generated recommendations");
    setNewTimeout("24:00:00");
}

if(localStorage.getItem("amount") == null) localStorage.setItem("amount","15");
document.getElementById("amount").placeholder = localStorage.getItem("amount");

if (refreshToken) {
    const accessToken = await tokenHandler.getAccessTokenViaRefreshToken(clientId, clientSecret, refreshToken);
    const profile = await tokenHandler.fetchProfile(accessToken);
    tokenHandler.populateUI(profile);
    log("logged in");
    // if (localStorage.getItem("timerIsSet") == null) {
    //     setNewTimeout("24:00:00");
    //     localStorage.setItem("timerIsSet", "true");
    // } else log("timer already set");
} else if (code) {
    const refreshToken = await tokenHandler.getRefreshToken(clientId, code);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.replace('/');
}

if (!refreshToken) {
    const buttons = document.querySelectorAll("div");
    buttons.forEach((elem) => {
        if (elem.id == "ui") elem.hidden = true;
    })
    const inputs = document.querySelectorAll("button");
    inputs.forEach((button) => {
        button.hidden = true;
    })
}

document.getElementById("logout").onclick = function () {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("amount");
    localStorage.removeItem("timerIsSet");
    window.location.reload();
}

document.getElementById("generate").onclick = function() {
    let amountPrototype = parseInt(document.getElementById("amount").value);
    let amount = !isNaN(amountPrototype) ? amountPrototype : parseInt(localStorage.getItem("amount"));
    apiHandler.generateRecommendations(amount);
}

document.getElementById("save").onclick = function() {
    let amount = document.getElementById("amount").value;
    localStorage.setItem("amount", amount ? amount : 15);
    log("saved track amount preferences");
    document.getElementById("amount").placeholder = localStorage.getItem("amount");
}

document.getElementById("reset").onclick = function() {
    localStorage.setItem("amount", "15");
    log("reset track amount preferences");
    document.getElementById("amount").placeholder = localStorage.getItem("amount");
}

export function log(message) {
    let msg = document.createElement("p");
    msg.id = "log_message";
    msg.innerHTML = `> ${message}`;
    document.getElementById("scrollable").appendChild(msg);
    document.getElementById("scrollable").scrollTop = msg.offsetHeight + msg.offsetTop;
}
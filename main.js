import * as tokenHandler from './token-handler.js';
import * as apiHandler from "./api-handler.js";
import {generateRecommendations} from "./api-handler.js";
import moment from 'moment';
import Cookies from 'js-cookie';
//TODO: LetsEncrypt certbot

const clientId = "c51c8fdaa8434884896fee43825e36c0";
const clientSecret = "1b2fde74a4b543abaae0d258ae500ee3";
const params = new URLSearchParams(window.location.search);
let code = params.get("code");
//const refreshToken = localStorage.getItem("refreshToken");
const refreshToken = Cookies.get('refreshToken', {path: '/'});

function setNewTimeout(time) {
    setTimeout(
        midnightTask,
        moment(time, "hh:mm:ss").diff(moment(), 'seconds')
    );
    log("set new timer");
}

async function midnightTask() {
    //await generateRecommendations(localStorage.getItem("amount"));
    await generateRecommendations(Cookies.get("amount", {path: '/'}));
    log("auto-generated recommendations");
    setNewTimeout("24:00:00");
}

//if(localStorage.getItem("amount") == null) localStorage.setItem("amount","15");
//document.getElementById("amount").placeholder = localStorage.getItem("amount");

if(!Cookies.get("amount") || Cookies.get("amount") === 'undefined') Cookies.set("amount","15", {expires: 14, path:'/'});
document.getElementById("amount").placeholder = Cookies.get("amount", {path: '/'});

if (refreshToken && refreshToken != 'undefined') {
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
    //localStorage.setItem("refreshToken", refreshToken);
    Cookies.set("refreshToken", refreshToken, {expires: 14, path: '/'});
    window.location.replace('/');
}

if (!refreshToken || refreshToken == 'undefined') {
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
    // localStorage.removeItem("refreshToken");
    // localStorage.removeItem("amount");
    // localStorage.removeItem("timerIsSet");
    Cookies.remove('refreshToken', {path: '/'});
    Cookies.set("amount", "15", {expires: 14, path: '/'});
    Cookies.remove('timerIsSet', {path: '/'});
    window.location.replace('/');
}

document.getElementById("generate").onclick = async function() {
    let amountPrototype = parseInt(document.getElementById("amount").value);
    //let amount = !isNaN(amountPrototype) ? amountPrototype : parseInt(localStorage.getItem("amount"));
    let amount = !isNaN(amountPrototype) ? amountPrototype : parseInt(Cookies.get("amount", {path: '/'}));
    await apiHandler.generateRecommendations(amount, "Recommendations playlist", 1);
}

document.getElementById("generate_shuffled").onclick = async function() {
    let amountPrototype = parseInt(document.getElementById("amount").value);
    //let amount = !isNaN(amountPrototype) ? amountPrototype : parseInt(localStorage.getItem("amount"));
    let amount = !isNaN(amountPrototype) ? amountPrototype : parseInt(Cookies.get("amount", {path: '/'}));
    await apiHandler.generateRecommendations(amount, "Daily Shuffle", 2);

}

document.getElementById("save").onclick = function() {
    let amount = document.getElementById("amount").value;
    //localStorage.setItem("amount", amount ? amount : 15);
    Cookies.set("amount", amount ? amount : 15, {expires: 14, path: '/'});
    log("saved track amount preferences");
    //document.getElementById("amount").placeholder = localStorage.getItem("amount");
    document.getElementById("amount").placeholder = Cookies.get("amount", {path: '/'});
}

document.getElementById("reset").onclick = function() {
    //localStorage.setItem("amount", "15");
    Cookies.set("amount", "15", {expires: 14, path: '/'});
    log("reset track amount preferences");
    //document.getElementById("amount").placeholder = localStorage.getItem("amount");
    document.getElementById("amount").placeholder = Cookies.get("amount", {path: '/'});
}

export function log(message) {
    let msg = document.createElement("p");
    msg.id = "log_message";
    msg.innerHTML = `> ${message}`;
    document.getElementById("scrollable").appendChild(msg);
    document.getElementById("scrollable").scrollTop = msg.offsetHeight + msg.offsetTop;
}
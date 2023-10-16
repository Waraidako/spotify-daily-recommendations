export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function clearCookies() {
    let Cookies = document.cookie.split(';');
    for (let i = 0; i < Cookies.length; i++)
        document.cookie = Cookies[i] + "=;expires=" + new Date(0).toUTCString();
}

export function updateCookie(cname) {
    let cookie = getCookie(cname);
    setCookie(cname, cookie, 14);
}
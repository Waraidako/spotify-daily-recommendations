import * as tokenHandler from "./token-handler.js"

const clientId = "c51c8fdaa8434884896fee43825e36c0";
const clientSecret = "1b2fde74a4b543abaae0d258ae500ee3";

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${await tokenHandler.getAccessTokenViaRefreshToken(clientId, clientSecret, localStorage.getItem("refreshToken"))}`,
        },
        method,
        body:JSON.stringify(body)
    });
    return await res.json();
}

async function getTopTracks(){
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        'v1/me/top/tracks?time_range=short_term&limit=15', 'GET'
    )).items;
}

export async function generateRecommendations() {

}
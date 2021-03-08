const fetch = require('node-fetch')
const querystring = require('querystring')

var access_token = ''
var reauthorize=true;

const client_id = '0ef8332626044b109dcd7da94f8fd798'
const client_secret = '3c11752bbecc492aae598c6f8bf2a3f0'
const scopes = 'user-top-read'
const redirect_uri = 'http://localhost:4000/callback'

function openSpotify(res){
    res.redirect('http://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect_uri)) +
        '&show_dialog=true'// + reauthorize.toString();
}

function authorize(code){
    reauthorize = false;
    let data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:4000/callback'
    }
    let auth = 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64');

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: querystring.stringify(data),
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': auth
        }
    })
    .then(res => { return res.json() })
    .then(data => {
        access_token = data.access_token
        return access_token
    })
}

function getArtist(){
    return fetch('https://api.spotify.com/v1/artists/5FwydyGVcsQllnM4xM6jw4', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    .then(res => { return res.json() })
}

function getTop(amount){
    return fetch('https://api.spotify.com/v1/me/top/tracks?' + new URLSearchParams({
        limit: amount,
    }), 
    {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    })
    .then(res => { return res.json() })
}

function logout(){
    access_token = '';
    reauthorize=true;
}

module.exports.openSpotify = openSpotify
module.exports.authorize = authorize
module.exports.getArtist = getArtist
module.exports.getTop = getTop
module.exports.spotifyLogout = logout
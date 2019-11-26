const gapi = window.gapi;

var clientId = '767596157395-mlgjapv3d0e5847jminnehdsd5lomloi.apps.googleusercontent.com';
var apiKey = 'AIzaSyDvQwZ1OvDl4owhkk1sq2jEs2uI1NUPCwM';
var scopes = 'https://www.googleapis.com/auth/drive ' +
    'https://www.googleapis.com/auth/documents' +
    'https://www.googleapis.com/auth/spreadsheets';


function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    window.setTimeout(checkAuth,1);
}

function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},handleAuthResult);
}

function handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('authorize-button');

    if (authResult && !authResult.error) {
        authorizeButton.style.visibility = 'hidden';
        makeApiCall();
    }
    else {
        authorizeButton.style.visibility = '';
        authorizeButton.onclick = handleAuthClick;
    }
}

function handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: [scopes], immediate: false}, handleAuthResult);
    return false;
}

function makeApiCall() {
    gapi.client.load('drive', 'v2', makeRequest);
}

function makeRequest() {
    var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'params': {'maxResults': '1'}
    });

    console.log(request);
}


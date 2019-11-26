/*
export default function sow_builder(sow_info) {
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '767596157395-mh5t870amk8a6e7vibgploiif40n4ksd.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyDx1h3sU6rMETn-S1N8Z-5ei_K0mmRb1uA';
    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().signIn();
    })

    listFiles()

}

function listFiles() {
    gapi.client.drive.files.list({
        'pageSize': 10,
        'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
        appendPre('Files:');
        var files = response.result.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                appendPre(file.name + ' (' + file.id + ')');
            }
        } else {
            appendPre('No files found.');
        }
    });
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function initGapi = () => {
    console.log('Initializing GAPI...');
    console.log('Creating the google script tag...');

    const script = document.createElement("script");
    script.onload = () => {
        console.log('Loaded script, now loading our api...')
        // Gapi isn't available immediately so we have to wait until it is to use gapi.
        this.loadClientWhenGapiReady(script);
    };
    script.src = "https://apis.google.com/js/client.js";

    document.body.appendChild(script);
}

function loadClientWhenGapiReady = (script) => {
    console.log('Trying To Load Client!');
    console.log(script)
    if(script.getAttribute('gapi_processed')){
        console.log('Client is ready! Now you can access gapi. :)');
        if(window.location.hostname==='localhost'){
            gapi.client.load("http://localhost:8080/_ah/api/discovery/v1/apis/metafields/v1/rest")
                .then((response) => {
                        console.log("Connected to metafields API locally.");
                    },
                    function (err) {
                        console.log("Error connecting to metafields API locally.");
                    }
                );
        }
    }
    else{
        console.log('Client wasn\'t ready, trying again in 100ms');
        setTimeout(() => {this.loadClientWhenGapiReady(script)}, 100);
    }
}

*/
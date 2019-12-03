import config from "../config"
import quote_type from "./quote_type_text";
import getCopperInfo from "./copper";

let SOW_DATA;
let TEMPLATE_ID = '';

export default async function start_build(data) {
    if(data) {
        SOW_DATA = data;
        var auth2 = window.gapi.auth2.getAuthInstance();
        // Sign the user in, and then retrieve their ID.
        auth2.signIn().then(function() {
            console.log(auth2.currentUser.get().getId());
        });
        return await componentDidMount();
    }
}

async function componentDidMount() {
    // 1. Load the JavaScript client library.
    async function wrapLoad() {
        return new Promise((resolve, reject) => {
            let return_link = '';
            window.gapi.load("client", () => {
                return_link = initClient();
                resolve(return_link);
            });
        });
    }
    return await wrapLoad();
}

async function initClient () {
    function wrapInit() {
        return new Promise((resolve, reject) => {
            //2. Initialize the JavaScript client library.
            window.gapi.client.init({
                apiKey: config.apiKey,
                clientId: config.clientId,
                scope: config.scopes,
                // Your API key will be automatically added to the Discovery Document URLs.
                discoveryDocs: config.discoveryDocs
            })
                .then(() => {

                    // 3. Initialize and make the API request.
                    //resolve(build_sow()); //this should be the one
                });
            resolve(build_sow());
        })
    }
    return await wrapInit();
}

async function build_sow() {
    let link;
    function wrapDriveInit() {
        return new Promise((resolve, reject) => {
            window.gapi.client.load("drive", "v3", () => {
                link = drive_changes();
                resolve(link);
            });
        })
    }
    return await wrapDriveInit();
}

async function drive_changes() {
    let service_name = '';
    if (SOW_DATA.service === "aci_supercharger_dsi") {
        service_name = "ACI Supercharger";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }
    else if (SOW_DATA.service === "hx_adoption_dsi") {
        service_name = "HX Adoption Services";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }
    else if (SOW_DATA.service === "ccp_adoption_dsi") {
        service_name = "Container Platform Adoption";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }
    else if (SOW_DATA.service === "ccc_adoption_dsi"){
        service_name = "Cloud Center Adoption";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }
    else {
        service_name = "";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }

    let copy_title = SOW_DATA.customer + ' ' + service_name + ' SoW';

    let body = {
        "name": copy_title,
        "parents": ["1i2dtbIUX-NonzrNrnDMqSBbuhvdMpGJP"],
    };
    let request = window.gapi.client.drive.files.copy({
        "fileId": TEMPLATE_ID,
        "supportsAllDrives": true,
        "resource": body
    });
    let return_link = await execute_copy(request);
    return new Promise((resolve, reject) => {
        resolve(return_link);
    });
}

async function execute_copy(request) {
    let date = new Date();
    //TODO giving the wrong date????
    let creation_date = date.getMonth() + ' ' + date.getDay() + ' ' + date.getFullYear();
    let customer_data = {
        "customer_name": SOW_DATA.customer,
        "date_of_creation": creation_date,
        "customer_address": "",
        "customer_address_city": "",
        "customer_web_link": "",
        "logo_url": ""
    };
    customer_data = await getCopperInfo(customer_data);

    let quote_type_text = '';
    if (SOW_DATA.quote === "Fixed Fee"){
        quote_type_text = quote_type.FIXEDFEE_TEXT;
    }
    else if (quote_type === "T&M"){
        quote_type_text = quote_type.TANDM_TEXT;
    }
    else{
        quote_type_text = "PLEASE ENTER INFORMATION OF HOW THIS IS TO BE BILLED AT THIS LOCATION";
    }

    let about_ignw = '';
    if (SOW_DATA.about === "Yes") {
        about_ignw = '';//TODO format_doc('1J3LtZJButJ8gGxg80ulBJ2xpeej4B7rL4b24VpV4s8A');
    }
    else {
        about_ignw = '';
    }

    let tandcs = '';
    if (SOW_DATA.tnc === "MSA") {
        tandcs = quote_type.MSA_TEXT;
    }
    else {
        tandcs = '';//TODO format_doc('1mT-6Bil5rZdtvVuFqS6bpZFhg-lZWmSokPiW5NPqAGo')
    }
    let copy_id = '';

    function wrapCopyRequest() {
        return new Promise((resolve, reject) => {
            request.execute((resp) => {
                copy_id = resp.id;
                resolve(resp);
            });
        })
    }

    await wrapCopyRequest();

    //TODO favicon logo stuff from copper here

    // TODO once the logo stuff is done do this
    let requests = [
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{customer_logo}}',
                    'matchCase': true
                },
                'replaceText': ' '
            }
        },
        {
            'insertInlineImage': {
                'uri': customer_data['logo_url'], "location": {'index': 78, 'segmentId': 'kix.hf1'},
                'objectSize': {'height': {'magnitude': 100, 'unit': 'PT'}, 'width': {'magnitude': 200, 'unit': 'PT'}}
            }
        },
        {
            'replaceAllText': {
                'containsText': {
                    'text': '{{terms_conditions}}',
                    'matchCase': true
                },
                'replaceText': tandcs
            }
        }
    ]
    let body = {
        'requests': requests
    }

    let update_doc = window.gapi.client.docs.documents.batchUpdate({
        'documentId': copy_id,
        'resource': body
    });
    update_doc.execute(function(resp) {
    });


    body = {
        "requests": [
            {
                "replaceAllText": {
                    "containsText": {
                        "text": "{{customer_name}}",
                        "matchCase": true
                    },
                    "replaceText": customer_data['customer_name']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_name}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['customer_name']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_web_link}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['customer_web_link']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{var_name}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.var
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{creator_name}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.name
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{date_of_creation}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['date_of_creation']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{quote_type}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.quote
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{about_ignw}}',
                        'matchCase': true
                    },
                    'replaceText': about_ignw
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{quote_type_text}}',
                        'matchCase': true
                    },
                    'replaceText': quote_type_text
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_address}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['customer_address']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_address_city}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['customer_address_city']
                }
            }
        ]
    };

    update_doc = window.gapi.client.docs.documents.batchUpdate({
        'documentId': copy_id,
        'resource': body
    });
    update_doc.execute(function (resp) {
    });

    let return_link = "https://drive.google.com/open?id=" + copy_id;
    //console.log("RETURN LINK: " + return_link);
    return new Promise((resolve, reject) => {
        resolve(return_link);
    })
}
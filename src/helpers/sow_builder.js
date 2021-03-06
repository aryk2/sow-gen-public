import config from "../config"
import getCopperInfo from "./copper";


let SOW_DATA;
let TEMPLATE_ID = '';

export default async function start_build(data) {
    if(data) {
        SOW_DATA = data;
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
    let links;
    function wrapDriveInit() {
        return new Promise((resolve, reject) => {
            window.gapi.client.load("drive", "v3", () => {
                links = drive_changes();
                resolve(links);
            });
        })
    }
    return await wrapDriveInit();
}

async function drive_changes() {
    let template_name = '';
    if (SOW_DATA.template === "aci_supercharger_dsi") {
        template_name = "ACI Supercharger SOW";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }
    else if (SOW_DATA.template === "tandm_sow_template") {
        template_name = "T&M SOW";
        TEMPLATE_ID = '1pJIYRsHuZsg7EXekOCZZaR373vJLJDdKtjJ-VfAjtys';
    }
    else if (SOW_DATA.template === "fixed_sow_template") {
        template_name = "Fixed SOW";
        TEMPLATE_ID = '1wIvFhOPwcR5r6Qv6k49mg65clmhzqdpCAgFKeiZHWTI';
    }
    else {
        template_name = "";
        TEMPLATE_ID = '1HcTHeyvJalfM0Yw2pykRz2Kfqm8Iy-CDHDJddob9eDA';
    }

    let docs_copy_title = SOW_DATA.customer + ' ' + template_name;

    let body = {
        "name": docs_copy_title,
        "parents": ["1i2dtbIUX-NonzrNrnDMqSBbuhvdMpGJP"],
    };
    let request = window.gapi.client.drive.files.copy({
        "fileId": TEMPLATE_ID,
        "supportsAllDrives": true,
        "resource": body
    });
    let return_link = await executeDocsCopy(request);
    let docsCopyLink = new Promise((resolve, reject) => {
        resolve(return_link);
    });
    const COSTING_TEMPLATE_ID = '1Z3IcxadWGi8E1I3Zu4L40Ah26CaT3QT3sS6z-hCrw5M';
    let sheets_copy_title = SOW_DATA.customer + ' ' + template_name + ' costing worksheet';
    let copy_body = {
        "name": sheets_copy_title,
        "parents": ["1i2dtbIUX-NonzrNrnDMqSBbuhvdMpGJP"],
    };
    request = window.gapi.client.drive.files.copy({
        "fileId": COSTING_TEMPLATE_ID,
        "supportsAllDrives": true,
        "resource": copy_body
    });
    return_link = await executeSheetsCopy(request);
    let sheetsCopyLink = new Promise((resolve, reject) => {
        resolve(return_link);
    });
    return {"docsLink": docsCopyLink, "sheetsLink": sheetsCopyLink};
}

async function executeDocsCopy(request) {
    let date = new Date();
    //TODO giving the wrong date????
    let creation_date = date.getMonth() + ' ' + date.getDay() + ' ' + date.getFullYear();
    let customer_data;
    if(SOW_DATA && SOW_DATA.customer) {
        customer_data = {
            "customer_name": SOW_DATA.customer,
            "date_of_creation": creation_date,
            "customer_address": "",
            "customer_address_city": "",
            "customer_web_link": "",
            "logo_url": "",
            "customer_background": "",
            "error": 0
        };
        if (SOW_DATA && SOW_DATA.customer_address && SOW_DATA.customer_website) {
            customer_data.customer_address = SOW_DATA.customer_address;
            customer_data.customer_web_link = SOW_DATA.customer_website;
        } else {
            let response = await getCopperInfo(customer_data, "getInfo");
            if (response.error === 0)
                customer_data = response;
        }
    }
    console.log(SOW_DATA);
    if(SOW_DATA && SOW_DATA.customer_background) {
        console.log(SOW_DATA.customer_background);
        customer_data.customer_background = SOW_DATA.customer_background;
    }

    let copy_id = '';

    function wrapDocsCopyRequest() {
        return new Promise((resolve, reject) => {
            request.execute((resp) => {
                copy_id = resp.id;
                resolve(resp);
            });
        })
    }

    await wrapDocsCopyRequest();


    if (!String(customer_data['logo_url']).endsWith(".png")) {
        customer_data['logo_url'] = "https://drive.google.com/open?id=1gNZJ5ST9aLPa7SKxbYEJUsSCCGI9hX5H";
    }

    let replace_logo = {
        "requests": [
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
                    'uri': customer_data['logo_url'], "location": {'index': 79, 'segmentId': 'kix.hf0'},
                    'objectSize': {
                        'height': {'magnitude': 100, 'unit': 'PT'},
                        'width': {'magnitude': 200, 'unit': 'PT'}
                    }
                }
            }
        ]
    };

    let update_doc = window.gapi.client.docs.documents.batchUpdate({
        'documentId': copy_id,
        'resource': replace_logo
    });
    update_doc.execute(function (resp) {
    });



    let text_body = {
        "requests": [
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
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{project_title}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.project_title
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{project_background}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.project_background
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{engagement}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.engagement
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_background}}',
                        'matchCase': true
                    },
                    'replaceText': customer_data['customer_background']
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{scope_description}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.scope_description
                }
            },
            {
                'replaceAllText': {
                    'containsText': {
                        'text': '{{customer_background}}',
                        'matchCase': true
                    },
                    'replaceText': SOW_DATA.phase_one
                }
            }
        ]
    };

    console.log("https://drive.google.com/open?id=" + copy_id);

    update_doc = window.gapi.client.docs.documents.batchUpdate({
        'documentId': copy_id,
        'resource': text_body
    });
    update_doc.execute(function (resp) {
    });

    let return_link = "https://drive.google.com/open?id=" + copy_id;

    if(String(copy_id) == 'undefined') {
        return_link = " ";

    }
    //console.log("RETURN LINK: " + return_link);
    return new Promise((resolve, reject) => {
        resolve(return_link);
    })
}

async function executeSheetsCopy(request) {
    let sheets_copy_id = '';
    function wrapSheetsCopyRequest() {
        return new Promise((resolve, reject) => {
            request.execute((resp) => {
                sheets_copy_id = resp.id;
                resolve(resp);
            });
        })
    }

    await wrapSheetsCopyRequest();

    let return_link = "https://drive.google.com/open?id=" + sheets_copy_id;

    if(String(sheets_copy_id) == 'undefined') {
        return_link = " ";

    }
    //console.log("RETURN LINK: " + return_link);
    return new Promise((resolve, reject) => {
        resolve(return_link);
    })
}
export default async function getCopperInfo(company_data, request_type){
    if(request_type === "getInfo")
        return await copperRequestWrapper(company_data);
    if(request_type === "checkName") {
        let empty_data = {
            "customer_name": company_data,
            "date_of_creation": "",
            "customer_address": "",
            "customer_address_city": "",
            "customer_web_link": "",
            "logo_url": "",
            "company_background": "",
            "error": 0
        };
        let response = await copperRequestWrapper(empty_data);
        if (response && response.error !== 0)
            return false;
        else
            return response;
    }
}

async function copperRequestWrapper(company_data) {
    let url = "https://us-central1-sow-gen.cloudfunctions.net/copper-info-dev";
    let headers = {
        'Content-Type': 'application/json'
    };
    if(company_data && company_data.customer_name) {
        let response =  await fetch(url, {
            method: 'POST',
            body: JSON.stringify(company_data), // json.dumps(data)
            headers: headers
        }).then(res => res.json());
        return response;
    }
}


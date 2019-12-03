export default async function getCopperInfo(company_data){
    return await copperRequestWrapper(company_data);

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

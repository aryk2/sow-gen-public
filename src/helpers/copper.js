export default async function get_info(company_data) {
    const url = "https://api.prosperworks.com/developer_api/v1/companies/search";
    const headers = {
        "X-PW-AccessToken": "9d99604f1d5655515055c3cb47bae6e9", "X-PW-Application": "developer_api",
        "X-PW-UserEmail": "akempler-delugach@ignw.io", "Content-Type": "application/json"
    };
    const data = {"name": company_data['customer'], "sort_by": "name", "page_size": 25};
    const response = await fetch(url, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // json.dumps(data)
        headers: headers
    }).then(res => res.text());
    console.log(response);
    let r = response[0];
    company_data["customer_address"] = parse_address(r["address"]);
    console.log(company_data["customer_address"])
}

function parse_address(address_data) {
    let address = "";
    if (address_data["street"] !== 'None')
        address += address_data["street"] + " ";
    else
        address += " {No Street Address Listed} ";
    if (address_data["city"] !== 'None')
            address += address_data["city"] + ", ";
    else
        address += " {No City Listed} ";
    if (address_data["state"] !== 'None')
            address += address_data["state"] + ". ";
    else
        address += " {No State Listed} ";
    if (address_data["postal_code"] !== 'None')
        address += address_data["postal_code"] + " ";
    else
        address += " {No Postal Code Listed} ";
    if (address_data["country"] !== 'None')
        address += address_data["country"] + ". ";
    else
        address += " {No Country Listed} ";
    return address
}
/*
def get_icon(websites):
if websites is not None:
    icon = (favicon.get(websites))[0]
else:
icon = 0
return icon.url */
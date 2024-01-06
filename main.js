const BigCommerce = require("node-bigcommerce")
require('dotenv').config()

const bigCommerce = new BigCommerce({
    clientId: process.env.CLIENT_ID,
    accessToken: process.env.TOKEN,
    apiVersion: 'v3',
    storeHash: process.env.STORE_HASH,
})

let page = 1
let limit = 250
let include_fields = 'sku,product_id'

const getProducts = async({page, limit, include_fields, results = []}) => {
    let url = `/catalog/variants?page=${page}&limit=${limit}&include_fields=${include_fields}`
    try {
        console.log(`Fetching page ${page} of variants`)
        let res = await bigCommerce.get(url)
        res.data.forEach(variant => results.push(variant))
        if(res.meta.pagination.current_page >= res.meta.pagination.total_pages)
            return results
        return await getProducts({page: page+1, limit, include_fields, results})
    } catch(err) {
        console.error(err)
    }
}

const job = async () =>  {
    const results = await getProducts({page, limit, include_fields})
    longSkus = results.filter(result => result.sku.length > 100)
    console.log(longSkus)
}

job()

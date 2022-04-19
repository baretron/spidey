// importing objects from npm installed libraries
const axios = require('axios');
const cheerio = require('cheerio');
// store string in a variable
const url = "https://www.iban.com/exchange-rates";
// envoke function defined below
// response is piped to then function
// then function accepts two functions: the first is called on success the secondis called on failure
fetchData(url).then( (res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
    statsTable.each(function() {
        let title = $(this).find('td').text();
        console.log(title);
    });
}, reason => console.log(reason))

// makes an asynchronous call to fetch data from supply url
async function fetchData(url){
    console.log("crawling data...")
    
    let response = await axios(url).catch((err) => console.log(err));
    
    if (response.status !== 200){
        console.log("Error occured while fetching data");
        return;
    }
    return response;
}
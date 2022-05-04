// importing objects from npm installed libraries
const axios = require('axios');
const cheerio = require('cheerio');
const { Worker } = require('worker_threads');
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

let workDir = __dirname + "/dbWorker.js";

const mainFunc = async () => {
    const url = "https://www.iban.com/exchange-rates";
    //fetch data from iban website
    let res = await fetchData(url);
    if(!res.data){
        console.log("invalid data Obj");
        return;
    }
    const html = res.data;
    // mount html page to the root element
    const $ = cheerio.load(html);

    let dataObj = new Object();
    const statsTable = $('.table.table-bordered.table-hover.downloads > tbody > tr');
    //loop through all the table rows and get table data
    statsTable.each(function() {
        let title = $(this).find('td').text(); //get the text in all the td elements
        let newStr = title.split("\t"); //convert text (string) into an array
        newStr.shift(); //strip off empty array element at index 0
        formatStr(newStr, dataObj); //format array string and store in and object
    });

    return dataObj;

}

mainFunc().then((res) => {
    // start worker
    const worker = new Worker(workDir);
    console.log("Sending crawled data to dbWorker...");
    //send formatted data to worker thread
    worker.postMessage(res);
    //listen to message from worker thread
    worker.on("message", (message) => {
        console.log(message)
    });
});

function formatStr(arr, dataObj){
    // regex to match all the words before the first digit
    let regExp = /[^A-Z]*(^\D+)/
    let newArr = arr[0].split(regExp); //split array element 0 using the regExp rule
    dataObj[newArr[0]] = newArr[2]; //store object
}

const {parentPort} = require('worker_threads');
const admin = require("firebase admin");
return(firebase);
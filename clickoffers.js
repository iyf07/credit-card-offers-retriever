// Generate and push all the supported URLs
var validUrl = [];
var amexOffers = ["https://global.americanexpress.com/offers/eligible", "AmexOffers"]
validUrl.push(amexOffers)

// Get the current URL and disable the button if it is not a valid URL
var curWeb = ""
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    let curUrl = tabs[0].url;
    let urlMatch = false;
    for (let i = 0; i < validUrl.length; i++) {
        if (curUrl == validUrl[i][0]) {
            document.getElementById("clickOffers").disabled = false;
            curWeb = validUrl[i][1]
            urlMatch = true;
            break;
        }
    }
    if (!urlMatch) {
        document.getElementById("clickOffers").disabled = true;
    }
});
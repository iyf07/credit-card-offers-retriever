// Get the current URL and disable the button if it is not a valid URL
var validUrl = ["https://global.americanexpress.com/offers/eligible"]
var currentUrl = document.getElementById("temp").innerHTML;
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    currentUrl = tabs[0].url;
    let urlMatch = false;
    for (let i = 0; i < validUrl.length; i++) {
        if (currentUrl == validUrl[i]) {
            document.getElementById("clickOffers").disabled = false
            urlMatch = true
            break
        }
    }
    if (!urlMatch) {
        document.getElementById("clickOffers").disabled = true
    }
});
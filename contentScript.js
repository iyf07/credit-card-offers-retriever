// Get the current tab URL
var curUrl = window.location.toString();

// List of available sites
const amex = "https://global.americanexpress.com/offers/"
const amexEligible = "https://global.americanexpress.com/offers/eligible";
const amexEnrolled = "https://global.americanexpress.com/offers/enrolled";

// Check the current tab
if (curUrl.startsWith(amex)) {
    addAmexOffers();
    getAmexOffers();
}

// Sleep function to wait
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add a button to the page which activates all offers
function addAmexOffers() {
    setTimeout(function () {
        const header = document.querySelector('.axp-offers__global__headerSection___1aNfL');
        var activateButton = addClickAmexOffersButton();
        header.appendChild(activateButton);
        activateButton.addEventListener('click', clickAmexOffers);
    }, 3000)
}

// Add a button with styles to the amex offers button
function addClickAmexOffersButton() {
    var activateButton = document.createElement('button');
    activateButton.id = 'activateAmexOffers';
    activateButton.className = ' css-ns91eb';
    activateButton.innerHTML = 'Activate Offers';
    activateButton.style.textAlign = "center";
    activateButton.style.marginLeft = "10px";
    return activateButton;
}

// Click the button to activate all offers. Will automatically reload
async function clickAmexOffers() {
    var curUrl = window.location.toString();
    if (!curUrl.startsWith(amexEligible)) {
        alert('Redirecting to the eligible offers page.');
        window.location.replace(amexEligible);
        return;
    }
    alert('Please do not close the page until all offers have been activated.')
    var times = 0;
    const offers = Array.from(document.getElementsByClassName("offer-cta")).filter(btn => btn.title === "Add to Card" || btn.title === "Activate Offer");
    for (const offer of offers) {
        offer.click();
        times++;
        if (times == 100) {
            break;
        }
    }
    alert('Offers have been activated.')
    location.reload();
}

// Add a button to the page which retrieves all offers
function getAmexOffers() {
    cleanLocalStorageOffers();
    setTimeout(function () {
        const header = document.querySelector('.axp-offers__global__headerSection___1aNfL');
        var retrieveButton = addRetrieveAmexOffersButton();
        header.appendChild(retrieveButton);
        retrieveButton.addEventListener('click', retrieveAmexOffers);
    }, 3000)
}

// Add a button with styles to the amex offers page
function addRetrieveAmexOffersButton() {
    var retrieveButton = document.createElement('button');
    retrieveButton.id = 'retrieveAmexOffers';
    retrieveButton.className = ' css-ns91eb';
    retrieveButton.innerHTML = 'Retrieve Offers';
    retrieveButton.style.textAlign = "center";
    retrieveButton.style.marginLeft = "10px";
    return retrieveButton;
}

// Retrieve all offers info
function retrieveAmexOffers() {
    var curUrl = window.location.toString();
    if (!curUrl.startsWith(amexEnrolled)) {
        alert('Redirecting to the enrolled offers page.');
        window.location.replace(amexEnrolled);
        return;
    }
    const accountNumber = document.getElementsByClassName('card-name heading-1 axp-account-switcher__accountSwitcher__lastFive___1s6L_ axp-account-switcher__accountSwitcher__hasOneCardLastFive___3mnDN');
    const vendorNames = document.getElementsByClassName('body-1 margin-0-b dls-gray-05');
    const offers = document.getElementsByClassName('heading-3 margin-0-b dls-gray-06');
    const rawCloseExpirations = document.getElementsByClassName('strong label-2 dls-red');
    const rawExpirations = document.getElementsByClassName('label-2 dls-gray-05');
    const today = new Date();

    for (let i = 0; i < vendorNames.length; i++) {
        const vendor = vendorNames[i].textContent;
        const offer = offers[i].textContent;
        const account = accountNumber[0].textContent;
        var expiration;
        var expirationISO;

        // Offers that expire soon
        if (i < rawCloseExpirations.length) {
            var closeExpiration = rawCloseExpirations[i].textContent;
            var expirationDate = new Date();
            switch (closeExpiration.length) {
                case 13:
                    break;
                case 16:
                    expirationDate.setDate(today.getDate() + 1);
                    break;
                case 17:
                    expirationDate.setDate(today.getDate() + parseInt(closeExpiration[11]));
                    break;
                case 18:
                    expirationDate.setDate(today.getDate() + parseInt(closeExpiration[12]) + parseInt(closeExpiration[11]) * 10);
                    break;
            }
            expirationISO = expirationDate.toISOString();
            var splits = expirationISO.split('-');
            expiration = splits[1] + '-' + splits[2].slice(0, 2) + '-' + splits[0];

            // offers that are not expiring in two weeks
        } else {
            expiration = rawExpirations[i - rawCloseExpirations.length].innerHTML;
        }
        var offerInfo = { 'offer': offer, 'expiration': expiration, 'bank': 'AmexOffers' };
        localStorage.setItem(vendor + account, JSON.stringify(offerInfo));
    }
    alert('All offers have been retrieved.');
}

// Clean expired offers in localstorage
function cleanLocalStorageOffers() {
    const today = new Date();
    for (let i = 0; i < localStorage.length; i++) {
        if (typeof (localStorage.getItem(localStorage.key(i))) == String) {
            var offerInfo = JSON.parse(localStorage.getItem(localStorage.key(i)));
            const expirationDate = new Date(offerInfo.expiration);
            if (expirationDate < today) {
                localStorage.removeItem(localStorage.key(i));
            }
        }
    }
}
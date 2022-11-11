// Get the current tab URL
const curUrl = window.location.toString();

// List of available sites
const amexEligible = "https://global.americanexpress.com/offers/eligible";
const amexEnrolled = "https://global.americanexpress.com/offers/enrolled";


// Check the current tab
switch (curUrl) {
    case amexEligible:
        addAmexOffers()
    case amexEnrolled:
        getAmexOffers();
}

// Sleep function to wait
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Add a button to the page which activates all offers
function addAmexOffers() {
    setTimeout(function () {
        const header = document.querySelector('.axp-offers__global__headerSection___1aNfL');
        const allButtons = document.getElementsByClassName("offer-cta");
        const offers = Array.from(allButtons).filter(button => button.title === "Add to Card" || button.title === "Activate Offer");
        var activateButton = addClickAmexOffersButton();
        header.appendChild(activateButton);
        if (offers.length == 0) {
            activateButton.setAttribute('disabled', true);
        }
        activateButton.addEventListener('click', clickAmexOffers);
    }, 3000)
}

// Add a button with styles to the amex offers button
function addClickAmexOffersButton() {
    var activateButton = document.createElement('button');
    activateButton.id = 'activateAmexOffers';
    activateButton.className = 'col-sm-12 col-md-3 col-lg-2 offer-cta axp-offers__global__fluid___15Bk5 css-1duq00z';
    activateButton.innerHTML = 'Activate Offers';
    activateButton.style.textAlign = "center";
    activateButton.style.marginLeft = "30px";
    return activateButton;
}

// Click the button to activate all offers. Will automatically reload
async function clickAmexOffers() {
    alert('Please do not close the page until all offers have been activated.')
    var offersActivated = 0;
    var emptyOffersTimes = 0;
    while (true) {
        const offers = Array.from(document.getElementsByClassName("offer-cta")).filter(btn => btn.title === "Add to Card" || btn.title === "Activate Offer");
        if (emptyOffersTimes == 2) {
            break
        }
        if (offers.length == 0) {
            emptyOffersTimes++;
            continue
        }
        for (const offer of offers) {
            offer.click();
            offersActivated++;
            await sleep(1000);
        };
        location.reload();
        await sleep(3000);
    }
    alert(offersActivated + ' offers have been activated.')
    removeClickAmexOffersButton();
}

// Remove the button after activating all offers
function removeClickAmexOffersButton() {
    var activateButton = document.getElementById('activateAmexOffers');
    activateButton.parentNode.removeChild(activateButton);
}

// Add a button to the page which retrieves all offers
function getAmexOffers() {
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
    retrieveButton.className = 'col-sm-12 col-md-3 col-lg-2  css-ns91eb';
    retrieveButton.innerHTML = 'Retrieve Offers';
    retrieveButton.style.textAlign = "center";
    retrieveButton.style.marginLeft = "30px";
    return retrieveButton;
}

// Retrieve all offers info
function retrieveAmexOffers() {
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
            expiration = splits[1] + '/' + splits[2].slice(0, 2) + '/' + splits[0];

        // offers that are not expiring in two weeks
        } else {
            expiration = rawExpirations[i - rawCloseExpirations.length].innerHTML;
            var splits = expiration.split('/')
            var expirationISODate = new Date(splits[2] + '-' + splits[0] + '-' + splits[1] + 'T00:00:00');
            expirationISO = expirationISODate.toISOString();
        }
        var val = { 'offer': offer, 'expiration': expiration, 'account': account, 'expirationISO': expirationISO };
        console.log(val)
    }
}
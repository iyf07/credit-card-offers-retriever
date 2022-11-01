// Get the current tab URL
const curUrl = window.location.toString();

// List of available sites
const amexEligible = "https://global.americanexpress.com/offers/eligible";
const amexEnrolled = "https://global.americanexpress.com/offers/enrolled";

// Check the current tab
switch (curUrl) {
    case amexEligible:
        amexOffers()
}

// Sleep function to wait
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Add a button to the page and add event listener to wait for a click
function amexOffers() {
    setTimeout(function () {
        const header = document.querySelector('.axp-offers__global__headerSection___1aNfL');
        const allButtons = document.getElementsByClassName("offer-cta");
        const offers = Array.from(allButtons).filter(button => button.title === "Add to Card" || button.title === "Activate Offer");
        var activateButton = header.querySelector('button');
        clickAmexOffersButton(activateButton);
        header.appendChild(activateButton);
        if (offers.length == 0) {
            activateButton.setAttribute('disabled', true);
        }
        activateButton.addEventListener('click', clickAmexOffers);
    }, 3000)
}

// Add styles to the amex offers button
function clickAmexOffersButton() {
    activateButton = document.createElement('button');
    activateButton.id = 'activateAmexOffers';
    activateButton.className = 'col - sm - 12 col - md - 3 col - lg - 2 offer - cta axp - offers__global__fluid___15Bk5 css - 1duq00z';
    activateButton.innerHTML = 'Activate Offers';
    activateButton.style.textAlign = "center";
    activateButton.style.marginLeft = "30px";
}

// Click the button to activate all offers. Will automatically reload
async function clickAmexOffers() {
    alert('Please do not close the page until all offers have been activated.')
    var offersActivated = 0;
    var emptyOffersTimes = 0;
    while (true) {
        const offers = Array.from(document.getElementsByClassName("offer-cta")).filter(btn => btn.title === "Add to Card" || btn.title === "Activate Offer");
        console.log(offers.length)
        if (emptyOffersTimes == 2) {
            alert(offersActivated + ' offers have been activated.')
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
}
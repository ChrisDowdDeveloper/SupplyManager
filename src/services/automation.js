const { Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = require('selenium-webdriver/chrome');
const { resolve } = require('path');

let driver;
let yourBrandUrls = [];
let webstaurantUrls = [];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function createDriver(browser) {
    if (!driver) {
        if (browser === "safari") {
            driver = await new Builder().forBrowser('safari').build();
        } else {
            const service = new ServiceBuilder(resolve('node_modules/webdriver-manager/bin/chromedriver'));
            const options = new chrome.Options();
            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .setChromeService(service)
                .build();
        }
    }
    return driver;
}

async function closeDriver() {
    if(driver) {
        await driver.quit();
        driver = null;
    }
}

async function loginYourBrand(driver) {
    await driver.get("https://www.yourbrandcafe.com/my-account/");
    const usernameYourBrand = process.env.YOURBRAND_EMAIL;
    const passwordYourBrand = process.env.YOURBRAND_PASSWORD;
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.findElement(By.id('email')).sendKeys(usernameYourBrand);
    await driver.wait(until.elementLocated(By.id('password')), 10000);
    await driver.findElement(By.id('password')).sendKeys(passwordYourBrand, Key.RETURN);
    await delay(3000);
}

async function loginWebstaurant(driver) {
    const usernameWebstaurant = process.env.WEBSTAURANT_EMAIL;
    const passwordWebstaurant = process.env.WEBSTAURANT_PASSWORD;

    await driver.get("https://www.webstaurantstore.com/myaccount");

    const emailField = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await emailField.sendKeys(usernameWebstaurant);

    const passwordField = await driver.wait(until.elementLocated(By.id('password')), 10000);
    await passwordField.sendKeys(passwordWebstaurant, Key.RETURN);

    await delay(3000);
}

async function yourBrandLogic(yourBrandUrls, driver) {
    try {
        for(let j = 0; j < yourBrandUrls.length; j++) {
            let current = yourBrandUrls[j];
            if(current.includes("https://www.yourbrandcafe.com/products/flat-lids") || url.includes("https://www.yourbrandcafe.com/products/eco")) {
                try {
                    driver.get(current);
                    let addButton = driver.findElement(By.className("single_add_to_cart_button"));
                    addButton.click();
                } catch(error) {
                    console.error(error);
                }
            } else {
                try {
                    driver.get(url);
                    let printOpt = driver.findElement(By.name("tm_attribute_pa_print-type_1"));
                    printOpt.click();
                    await delay(2000);
                    let  printLoc = driver.findElement(By.name("tmcp_radio_0"));
                    printLoc.click();
                    await delay(2000);
                    let artwork = driver.findElement(By.xpath("(//input[@name='tmcp_radio_5'])[2]"));
                    artwork.click();
                    await delay(2000);
                    let verify = driver.findElement(By.name("tmcp_checkbox_9_0"));
                    verify.click();
                    await delay(2000);
                    let addButton = driver.findElement(By.className("single_add_to_cart_button"));
                    addButton.click();
                    await delay(2000);
                } catch(error) {
                    console.error(error);
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}

async function webstaurantLogic(webstaurantUrls, driver) {
    try {
        for(let k = 0; k < webstaurantUrls.length; k++) {
            let currentWeb = webstaurantUrls[k];
            try {
                driver.get(currentWeb);
                try {
                    let addButton = await driver.findElement(By.id("buyButton"));
                    if (addButton != null) {
                        await addButton.click();
                        await delay(3000);
                    } else {
                        let isUnavailable = await driver.findElement(By.id("unavailableContainer"));
                        if (isUnavailable != null) {
                            console.log("item unavailable: " + currentWeb);
                            continue;
                        }
                    }
                } catch(error) {
                    console.error(error);
                }
            } catch(error) {
                console.error(error);
            }
        }
    } catch (error) {
        
    }
}


async function addToCart(driver) {
    if(webstaurantUrls.length > 0) {
        await loginWebstaurant(driver)
        await webstaurantLogic(webstaurantUrls, driver);
    }
    if(yourBrandUrls.length > 0) {
        await loginYourBrand(driver)
        await yourBrandLogic(yourBrandUrls, driver);
    }
}

async function seperateURLs(order) {
    for(let i = 0; i < order.length; i++) {
        const url = order[i].item_url;

        if(!url) {
            console.error(`Invalid url on item ${i + 1}`)
            continue;
        }
        if(typeof url != 'string' || !url.startsWith('http')) {
            console.error(`Invalid url on item ${i + 1}`)
        }

        if(url.includes("https://www.yourbrandcafe.com")) yourBrandUrls.push(url)
        if(url.includes("https://www.webstaurantstore.com")) webstaurantUrls.push(url);
    }
}

async function automate(browser, order) {
    await seperateURLs(order);
    try {
        await createDriver(browser);
        await addToCart(driver);
        await delay(2000);
    } catch(error) {
        console.error("Checkout error: " + error);
    } finally {
        await closeDriver();
    }
}

module.exports = automate;
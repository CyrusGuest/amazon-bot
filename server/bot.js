require("dotenv").config();
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");
const db = require("./db");

const signInURL =
  "https://www.amazon.com/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_ya_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=usflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&";

const userEmail = process.env.USEREMAIL;
const userPassword = process.env.USERPASSWORD;
let trackers = [];

const startNewTracker = async (url, max_price, product_id) => {
  const page = await userSignIn(url);
  if (!page) return;

  let job = new CronJob(
    "* * * * *",
    () => {
      //runs every 30 minutes in this config
      checkPrice(url, page, max_price, product_id);
    },
    null,
    true,
    null,
    null,
    true
  );
  job.start();
  trackers.push({ url, job });
  return job;
};

const configureBrowser = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(signInURL);
  return page;
};

const userSignIn = async (url) => {
  try {
    // Launch and configure browser
    const page = await configureBrowser();
    // Begin entering form information
    await page.click("#ap_email", {
      button: "left",
      delay: 10,
    });
    await page.keyboard.type(userEmail);

    // Submit email and wait until navigation is complete
    await Promise.all([
      page.click("#continue", {
        button: "left",
        delay: 10,
      }),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
    const emailErrorMessage = await page.evaluate(() => {
      const el = document.querySelector(".a-alert-heading");
      return el ? el.innerText === "There was a problem" : false;
    });
    if (emailErrorMessage) throw "Invalid email";

    // Begin entering password
    await page.click("#ap_password", {
      button: "left",
      delay: 10,
    });
    await page.keyboard.type(userPassword);
    // Sign in and wait until navigation is complete
    await Promise.all([
      page.click("#signInSubmit", {
        button: "left",
        delay: 10,
      }),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);
    const passwordErrorMessage = await page.evaluate(() => {
      const el = document.querySelector(".a-alert-heading");
      return el ? el.innerText === "There was a problem" : false;
    });
    if (passwordErrorMessage) throw "Incorrect password";

    await page.goto(url);
    return page;
  } catch (error) {
    console.log("Error signing user in: " + error);
  }
};

const buyProduct = async (url, page) => {
  try {
    await page.goto(url);
    await page.click("#buy-now-button");
    await page.waitForTimeout(5000);
    if (page.url !== url) {
      // REDIRECTED
      await page.click(".a-button-input");
      await page.waitForTimeout(5000);
      await page.screenshot({ path: "ordersummary.png", fullPage: true });
      await page.goto(url);
      const tracker = trackers.filter((tracker) => tracker.url === url);
      tracker[0].job.stop();
      return;
    }
    await page.click("#turbo-checkout-pyo-button");
    await page.screenshot({ path: "ordersummary.png", fullPage: true });
    const tracker = trackers.filter((tracker) => tracker.url === url);
    tracker[0].job.stop();
    return;
  } catch (error) {
    console.log("Error purchasing product: " + error);
  }
};

const checkPrice = async (url, page, max_price, product_id) => {
  await page.reload();

  const html = await page.evaluate(() => document.body.innerHTML);
  const $ = cheerio.load(html);
  const dollarPrice = $("#priceblock_ourprice").text();
  if (dollarPrice) {
    const currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ""));

    await updatePrice(product_id, currentPrice);

    if (currentPrice < max_price) {
      await buyProduct(url, page);
      return;
    }
  }
};

const updatePrice = async (product_id, price) => {
  try {
    await db.query("UPDATE products SET price = $1 WHERE product_id = $2", [
      price,
      product_id,
    ]);
  } catch (error) {
    console.log(error);
  }
};

const stopTracker = (job) => job.stop();

exports.startNewTracker = startNewTracker;
exports.stopTracker = stopTracker;

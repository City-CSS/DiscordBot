require('dotenv').config();
const { default: puppeteer } = require("puppeteer");

let URL = "https://www.citystudents.co.uk/organisation/memberlist/55351/";//need to sign into the website
let URL2 = "https://www.citystudents.co.uk/sso/login.ashx?ReturnUrl=/organisation/memberlist/55351/";
const getQuotes = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    // Open a new page
    const page = await browser.newPage();
  
    await page.goto(URL2);
    await page.type('#userNameArea', process.env.LOGIN_USERNAME);
    await page.type('#passwordInput', process.env.PASSWORD);

    await page.click('#submitButton');

    await page.waitForNavigation(); // <------------------------- Wait for Navigation

    // Get page data
    const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        // Get the displayed text and returns it
        const quoteList = document.querySelectorAll(".msl_row"||".msl_altrow");

        // Convert the quoteList to an iterable array
        // For each quote fetch the text and author
        return Array.from(quoteList).map((quote) => {
            // Fetch the sub-elements from the previously fetched quote element
            // Get the displayed text and return it (`.innerText`)
            const name = quote.querySelector("tr > td:nth-child(1)").innerText;
            const ID = quote.querySelector("tr > td:nth-child(2)").innerText;

            return { name, ID };
        });
    });

    // Display the quotes
    console.log(quotes);
  };
  
  // Start the scraping
  getQuotes();

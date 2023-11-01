require('dotenv').config();
const { default: puppeteer } = require("puppeteer");
const UsersDB = require('../models/Users');
const mongoose = require('mongoose');

let URL2 = "https://www.citystudents.co.uk/sso/login.ashx?ReturnUrl=/organisation/memberlist/55351/";
module.exports = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch(
      {
        headless:"new",
        defaultViewport:null,
        executablePath: '/usr/bin/chromium-browser',
      }
    );
  
    // Open a new page
    const page = await browser.newPage();
  
    await page.goto(URL2);
    await page.type('#userNameArea', process.env.LOGIN_USERNAME);
    await page.type('#passwordInput', process.env.PASSWORD);

    await page.click('#submitButton');

    await page.waitForNavigation(); // <------------------------- Wait for Navigation

    await page.select('#ctl00_Main_ddPageSize', '0')

    await page.waitForNavigation(); // <------------------------- Wait for Navigation

    // Get page data
    const users = await page.evaluate(() => {
        
        const userList = document.querySelectorAll(".msl_row");

        return Array.from(userList).map((user) => {
            
            const name = user.querySelector("tr > td:nth-child(1)").innerText.toUpperCase();
            const ID = user.querySelector("tr > td:nth-child(2)").innerText;

            return { name, ID };
        });
    });

    const usersALT = await page.evaluate(() => {
        
      const userList = document.querySelectorAll(".msl_altrow");

      return Array.from(userList).map((user) => {
          
          const name = user.querySelector("tr > td:nth-child(1)").innerText.toUpperCase();
          const ID = user.querySelector("tr > td:nth-child(2)").innerText;

          return { name, ID };
      });
  });
  const finalArray = users.concat(usersALT);
  
  console.log(finalArray.length);
  console.log(finalArray);
  await browser.close();
  mongoose.connect('mongodb://127.0.0.1:27017/discordJS');

  for(var user in finalArray){
    let userTEMP = await UsersDB.findOne({userId : finalArray[user].ID})
    let username = finalArray[user].name.split(", ");
    
    console.log(username);
    if(!userTEMP){
      userTEMP = new UsersDB(
        {
            userFirstName: username[1],
            userSurname: username[0],
            userId: finalArray[user].ID,
            discordActivated: false,
        }
      );
      await userTEMP.save();
    }
  }
};
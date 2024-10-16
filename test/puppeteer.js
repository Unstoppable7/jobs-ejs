const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword, factory } = require("../utils/seed_db");
const Job = require("../models/Job");

let testUser = null;
let testJob = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("jobs-ejs puppeteer test", function () {
   before(async function () {
      this.timeout(10000);
      //await sleeper(5000)
      //  browser = await puppeteer.launch();
      browser = await puppeteer.launch({ headless: false, slowMo: 30 });
      page = await browser.newPage();
      await page.goto("http://localhost:3000");
   });
   after(async function () {
      this.timeout(5000);
      await browser.close();
   });
   describe("got to site", function () {
      it("should have completed a connection", async function () {});
   });
   describe("index page test", function () {
      this.timeout(10000);
      it("finds the index page logon link", async () => {
         this.logonLink = await page.waitForSelector(
            "a ::-p-text(Click this link to logon)"
         );
      });
      it("gets to the logon page", async () => {
         await this.logonLink.click();
         await page.waitForNavigation();
         const email = await page.waitForSelector('input[name="email"]');
      });
   });
   describe("logon page test", function () {
      this.timeout(20000);
      it("resolves all the fields", async () => {
         this.email = await page.waitForSelector('input[name="email"]');
         this.password = await page.waitForSelector('input[name="password"]');
         this.submit = await page.waitForSelector("button ::-p-text(Logon)");
      });
      it("sends the logon", async () => {
         testUser = await seed_db();
         await this.email.type(testUser.email);
         await this.password.type(testUserPassword);
         await this.submit.click();
         await page.waitForNavigation();
         await page.waitForSelector(
            `p ::-p-text(${testUser.name} is logged on.)`
         );
         await page.waitForSelector("a ::-p-text(change the secret)");
         await page.waitForSelector('a[href="/secretWord"]');
         const copyr = await page.waitForSelector("p ::-p-text(copyright)");
         const copyrText = await copyr.evaluate((el) => el.textContent);
         console.log("copyright text: ", copyrText);
      });
   });
   describe("puppeteer job operations", function () {
      this.timeout(20000);
      it("do a click on the link for the jobs list", async () => {
         const { expect } = await import("chai");
         this.jobsListLink = await page.waitForSelector(
            "a ::-p-text(Click this link to jobs)"
         );
         await this.jobsListLink.click();
         await page.waitForNavigation();
         await page.waitForSelector('table[id="jobs-table"]');
         const pageContent = await page.content();
         const tableRows = pageContent.split("<tr>");
         expect(tableRows.length).to.equal(21);
      });

      it("do a click on the button for add a job", async () => {
         this.addJobLink = await page.waitForSelector(
            "button ::-p-text(Add New Entry)"
         );
         await this.addJobLink.click();
         await page.waitForNavigation();
         await page.waitForSelector('input[name="company"]');
         this.newJobCompany = await page.waitForSelector(
            'input[name="company"]'
         );
         this.newJobPosition = await page.waitForSelector(
            'input[name="position"]'
         );
         this.newJobStatus = await page.waitForSelector(
            'input[name="status"]'
         );
         this.newJobsubmit = await page.waitForSelector(
            "button ::-p-text(Create Job)"
         );
      });
      it("sends new job", async () => {
         const { expect } = await import("chai");
         testJob = await factory.build("job");
         await this.newJobCompany.type(testJob.company);
         await this.newJobPosition.type(testJob.position);
         await this.newJobStatus.type(testJob.status);
         await this.newJobsubmit.click();
         await page.waitForNavigation();
         await page.waitForSelector(
            `div ::-p-text(The job has been created successfully)`
         );
         const lastJob = await Job.findOne().sort({ _id: -1 });
         expect(lastJob.company).equal(testJob.company);
         expect(lastJob.position).equal(testJob.position);
         expect(lastJob.status).equal(testJob.status);
      });
   });
});

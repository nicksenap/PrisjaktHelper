const puppeteer = require("puppeteer");

describe("Extension", () => {
  let browser;
  let page;

  beforeAll(async () => {
    const extensionPath = path.resolve(__dirname, "../"); // Update the relative path to the extension's directory from the test file

    browser = await puppeteer.launch({
      headless: false, // Set to false to see the browser window
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    page = await browser.newPage();
    await page.goto("https://www.prisjakt.nu/produkt.php?p=2008963"); // Replace with the URL of a product page on Prisjakt
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should load the extension", async () => {
    const isExtensionLoaded = await page.evaluate(() => {
      return (
        typeof chrome.extension !== "undefined" &&
        typeof chrome.extension.getBackgroundPage === "function"
      );
    });

    expect(isExtensionLoaded).toBe(true);
  });

  it("should have buttons with specified color", async () => {
    // Wait for the buttons to appear on the page
    await page.waitForSelector('button[aria-label="Gå till butik"]');

    // Get the buttons with the specified aria-label
    const buttons = await page.$$('button[aria-label="Gå till butik"]');

    // Assert that at least one button exists
    expect(buttons.length).toBeGreaterThan(0);

    let foundMatchingColor = false;

    // Iterate over the buttons and verify their background-color
    for (const button of buttons) {
      const backgroundColor = await button.evaluate(
        (element) => getComputedStyle(element).backgroundColor
      );

      // Verify if the background-color matches the expected value
      if (backgroundColor === "rgb(171, 105, 136)") {
        foundMatchingColor = true;
        break;
      }
    }

    // Assert that at least one button has the specified color
    expect(foundMatchingColor).toBe(true);
  });
});

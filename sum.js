const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // Seed URLs
  const urls = Array.from(
    { length: 10 },
    (_, i) => `https://sanand0.github.io/tdsdata/js_table/?seed=${i + 32}`
  );

  let grandTotal = 0;

  for (const url of urls) {
    console.log(`\nVisiting: ${url}`);

    await page.goto(url, {
      waitUntil: "networkidle",
    });

    // Wait until tables are loaded
    await page.waitForSelector("table");

    // Read all numeric cells from every table
    const numbers = await page.$$eval("table td", (cells) =>
      cells
        .map((cell) => Number(cell.textContent.trim()))
        .filter((n) => !Number.isNaN(n))
    );

    const pageTotal = numbers.reduce((sum, n) => sum + n, 0);

    console.log(`Numbers found : ${numbers.length}`);
    console.log(`Page Total    : ${pageTotal}`);

    grandTotal += pageTotal;
  }

  console.log("\n======================================");
  console.log(`FINAL TOTAL = ${grandTotal}`);
  console.log("======================================");

  await browser.close();
})();
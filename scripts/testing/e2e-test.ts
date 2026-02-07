import puppeteer from 'puppeteer';

async function runE2ETest() {
    console.log('🧪 Starting E2E Test...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const baseUrl = 'http://localhost:3000';

    try {
        // 1. Visit homepage
        console.log('Visiting homepage...');
        await page.goto(baseUrl, { waitUntil: 'networkidle2' });

        // Wait for hydration
        await page.waitForSelector('h1');
        const title = await page.$eval('h1', el => el.textContent);
        console.log(`Page title found: ${title}`);

        // 2. Check for "Connect Wallet" button
        console.log('Checking for Connect Wallet button...');
        const connectBtn = await page.waitForSelector('button ::-p-text(Connect Wallet)');
        if (connectBtn) {
            console.log('✅ Connect Wallet button found');
        }

        // 3. Check Legal Disclaimer
        console.log('Verifying Legal Disclaimer...');
        const disclaimer = await page.waitForSelector('text/Disclaimer');
        if (disclaimer) {
            console.log('✅ Legal Disclaimer visible');
        }

        // 4. Input swap details (AmountInput uses type="text" or "number")
        console.log('Attempting to input swap details...');
        // We look for the first input which is usually AmountIn
        const inputs = await page.$$('input');
        if (inputs.length > 0) {
            await inputs[0].type('10');
            console.log('✅ Amount input successful');
        }

        // 5. Verify Dex routing UI (even if we don't click swap, we can see the UI elements)
        const slippageLabel = await page.waitForSelector('text/Slippage Tolerance');
        if (slippageLabel) {
            console.log('✅ Slippage settings visible');
        }

        console.log('✅ E2E Sanity Test completed successfully');
    } catch (err) {
        console.error('❌ E2E Test failed:', err);
        // Take screenshot on failure
        await page.screenshot({ path: 'e2e-failure.png' });
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runE2ETest();

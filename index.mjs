import express from "express"
import { chromium } from "playwright"

let app = express()
app.use(express.static("."))

// racy with main
app.listen(8123, () => {
    console.log(`Example app listening on port ${8123}`)
})

async function main() {
    let browser = await chromium.launch({ headless: false })
    let context = await browser.newContext({ ignoreHTTPSErrors: true })
    let page = await context.newPage()

    await page.goto("https://google.com")

    await page.evaluate(() => {
        let elem = document.createElement("img")
        elem.src = "http://localhost:8123/flag.png"
        document.body.appendChild(elem)
    })
}

await main()

import express from "express"
const app = express();
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
})
const page = await browser.newPage();

app.get("/setPackage", async (req, res) => {
    try {
        await page.goto("https://play.google.com/store/apps/details?id=" + req.query.name, { waitUntil: "domcontentloaded" });

        await page.evaluate(() => {
            const seeReviewBtn = document.querySelector("div[data-g-id=reviews]").lastChild;
            seeReviewBtn.firstChild.firstChild.firstChild.click();
        })

        res.send("done")
    } catch (error) {
        res.json({ error: true, message: "Package not found"})
    }
})

app.get("/", async (req, res) => {
    try{
        let data = await page.evaluate(() => {
            let info = [];
            const appName = document.querySelector("[itemprop=name]").innerText;
            const scEle = document.querySelector(`.VfPpkd-P5QLlc`).lastChild.lastChild.lastChild.lastChild.lastChild
            scEle.childNodes[1].lastChild.scrollIntoView()
            scEle.childNodes[1].childNodes.forEach(element => {
                const author_Image = element.firstChild.firstChild.firstChild.childNodes[0].src;
                const author_Name = element.firstChild.firstChild.firstChild.childNodes[1].innerHTML;
                const star = element.firstChild.lastChild.childNodes[0].getAttribute("aria-label")
                const reviewDate = element.firstChild.lastChild.childNodes[1].innerHTML
                const review = element.childNodes[1].innerHTML
                info.push({ author_Image, author_Name, star, reviewDate, review });
            });
    
            return [appName, info];
        })
    
        res.json({ AppName: data[0], count: data[1].length, data: data[1] })
    }catch(error){
        res.json({error:true,message:"Something wrong happened , contact 9667067062 for further info"})
    }
})

app.listen(4000, () => {
    console.log("server started");
})
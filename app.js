const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/', async (req, res, next) => {
  res.send(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDF Generator</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500&display=swap');
      * {
        box-sizing: border-box;
      }
      body {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        margin: 0;
        overflow: hidden;
        height: 100vh;
        
      }
      h2 {
        font-weight:300;
        font-size:50px;
      }
      p {
        margin-top:0;
        text-align: center;
        font-weight: 300;
        font-size: 30px;
      }

      a {
        text-decoration: none;
        border: 1px solid rgb(231, 223, 213);
        background-color: rgb(14, 148, 201);
        color: black;
        border-radius: 5px;
        font-size: 18px;
        padding: 10px 25px;
      }

      input {
        text-decoration: none;
        border: 1px solid rgb(231, 223, 213);
        border-radius: 5px;
        font-size: 18px;
        padding: 10px 25px;
        background-color: white;
        border-color: black;
      }

      a:hover {
        background-color: rgb(39, 185, 243);
      }
      a:focus,
      input:focus {
        outline: none;
      }

      @media (max-width: 380px) {
        a {
          font-size: 8px;
          padding: 10px 25px;
        }

        input {
          font-size: 10px;
          padding: 10px 25px;
        }
      }
    </style>
  </head>
  <body>
    <h2>HTML TO PDF</h2>
    <p>Insert Link Here</p>
    <div>
      <input type="text" id="input" required />
      <a href="#" id="anchor" onclick="goToWebsite()">Click Here</a>
    </div>
  </body>

  <script>
    const input = document.getElementById('input');

    function goToWebsite() {
      const url = input.value;
      const anchor = document.getElementById('anchor');
      anchor.href = 'http://localhost:3000/pdf?target=' + url;
    }
  </script>
</html>

    `
  );

  next();
});

app.get('/pdf', async (req, res, next) => {
  console.log('im here', req.url);
  const url = req.query.target;
  console.log(req.query.target);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const webPage = await browser.newPage();

  await webPage.setViewport({ width: 1200, height: 800 });
  try {
    await webPage.goto(url, {
      waitUntil: 'load',
      timeout: 0,
    });
  } catch (e) {
    console.log("Web Page doesn't exists!");
    res.send(`
      <h2 style="text-align:center;margin-top:25%;">Sorry! Web Page doesn't exists!</h2>
    `);
  }

  const pdf = await webPage.pdf({
    printBackground: true,
    path: 'webPage.pdf',
    format: 'A4',
    margin: {
      top: '20px',
      bottom: '40px',
      left: '20px',
      right: '20px',
    },
  });

  await browser.close();

  res.contentType('application/pdf');
  res.send(pdf);
  next();
});

app.listen(3000, () => {
  console.log('Connected to Server');
});

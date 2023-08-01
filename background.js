
console.log("Starting Extension....");
let loadTime = new Date();
let manifest = chrome.runtime.getManifest();

chrome.notifications.create('onInstalled', {
  title: `CloudFlare Bypasser Extension Version: ${manifest.version}`,
  message: `onInstalled has been called, background page loaded at ${loadTime.getHours()}:${loadTime.getMinutes()}`,
  type: 'basic',
  iconUrl: 'icons/window.png'
});

const PROXY_LISTENER_URL = 'https://yourwebserverjs.com/write';
const INTERVAL = 300; //how often to grab new page & send to proxy (>= 1000 use milliseconds val [960=16m] [1000=1s] [1d=86400*1000] or [10s=10])
const SEARCH_TITLE_STR = 'Binance'; //What to look for in the title of the tab we want to get the contents of.

//Send a browser push notification
function sendNotification(title, message, type) {
  let notification = "notification-"+(Math.random() + 1).toString(36).substring(7);
  chrome.notifications.create(notification, {
    title,
    message,
    type: type ? type : 'basic'
  });
}

async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return "Error fetching IP: "+JSON.stringify(error);
  }
}

//send a message to discord channel for logging purposes
const webhook_url = "https://discord.com/api/webhooks/<channel_id>/<webhook>"; //edit channel in discord, go to implementations, add webhook.
async function sendMessage(msg) {
    var ip = await getUserIP();
    console.log("ip", ip);

    if(typeof(msg.error) != "undefined") var error = { image: {url: "http://yoursite.com/someerrorimage.png",} }
    else var error = {};

    var params = {
      username: "CloudFlare Smasher",
      avatar_url: "http://yoursite.com/someavatar.png",
      embeds:[{
        "color": 16711680,
        "title":"Extension IP: "+ip,
        "description":`Sent Page Contents to proxy and got response: ${JSON.stringify(msg)}`,
        ...error
      }] //image: {url: "http://bsc-idx.dexcelerate.com/pepe-8bit-cry.gif",}
    }

    const rawResponse = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        //'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    const content = await rawResponse.text();

    console.log("Discord webhook response", content);
}


//just chill for a bit (>= 1000 use milliseconds val [960=16m] [1000=1s] [1d=86400*1000] or [10s=10])
function sleep(ms) {
  if(ms < 1000) ms = ms * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Function to inject code into the DOM of any tab(s).
function runCode() {
  chrome.tabs.executeScript({
    code: `console.log('location:', window.location.href);`
  });
}

//Open up a new pinned tab with the page we want to get the contents of.
async function openMyPage() {
   await chrome.tabs.create({
     "url": "https://bscscan.com/contractsVerified",
     "pinned": true,
     //"active": false
   });
   await sleep(5); // wait 5 seconds to ensure CF check is passed & page is loaded
   await getBinancePageSrc();
}

//Send the HTML contents to our proxy listener which will save the page contents & make it available to whatever other process(es) need it.
const sendHtmlToProxy = async (html) => {
  console.log(`Sending HTML to Proxy Listener ${PROXY_LISTENER_URL}`)
  var r = await fetch(PROXY_LISTENER_URL, {
      //mode: "no-cors",
      method: "POST",
      headers: {
        //"Content-Type": "application/json",
      },
      body: html//JSON.stringify({ contents: html }),
    })
  let response = await r.text();
  console.log("Got Response from Proxy Listener!", response);
  sendMessage(response);
}

//Sends a message to page-eater.js and asks for the HTML source code from the loaded binance page.
const askForInfoFromTab = async (tab) => {
  if(typeof(tab?.id) == "undefined") return;

   sendMessageToTab(tab.id, {text: 'page_html'}).then(async (response) => {
    console.log("response", response);
    let title = response?.title;

    console.log(`Got Response from Tab #${tab.id} (${title})`, response);

    //Make sure the tab contains the title search str we're looking for.
    if(title.includes(SEARCH_TITLE_STR)) {
      console.log("Page Title Contains 'Binance'!", title);
      await sendHtmlToProxy(response.html);
      let rand = Math.random() * (30 - 1);
      await chrome.tabs.remove(tab.id);
      await sleep(INTERVAL+rand);
      await openMyPage();
    } else throw Error("Couldn't find binance tab...");

  }).catch(async (error) => { //Error sending message to the tab
    //await sendMessage({error: "wtf m8, error grabbing data from browser tab."});
    console.error(`Error Sending Message to #${tab.id}: ${error}`);
    return Error(error);
  });
}

//generic sendMessageToTab function to get around manifest v3 async issues.
function sendMessageToTab(tabId, message) {
  console.log("sendMessageToTab", tabId, message);
  return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, resolve)
  })
}

//Loop all tabs and find the one with a title that includes the SEARCH_TITLE_STR
async function getBinancePageSrc() {
  let found = false;
  let browserFix = getBrowser() == 'Firefox' ? browser : chrome;

  browserFix.tabs.query({
    //currentWindow: true,
    //active: true,
  }).then(async (tabs) => {
    for (const tab of tabs) {
      if(tab.title.includes(SEARCH_TITLE_STR)) await askForInfoFromTab(tab);
      //if already found then close any other open binance tabs so we always get a fresh one.
      if(found && tab.title.includes(SEARCH_TITLE_STR)) await chrome.tabs.remove(tab.id);
      found = true;
    }
  }).catch(async (error) => {
    console.error(`Error: ${JSON.stringify(error)}`);
    await sendMessage(error);
    //return closeTabAndRestart(tab);
  });
}

//function to determine which browser the extension is running in
function getBrowser() {
  if (typeof chrome !== "undefined") {
    if (typeof browser !== "undefined") {
      return "Firefox";
    } else {
      return "Chrome";
    }
  } else {
    return "Edge";
  }
}

//init
const init = async () => {
  await openMyPage();
}
init();


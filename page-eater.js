console.log("Hello World!");

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

let browserFix = getBrowser() == 'Firefox' ? browser : chrome;

browserFix.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Message from the background script:", msg);

    if (msg.text === 'page_html') {
      //return Promise.resolve({ html: document.all[0].outerHTML, title: document.title });
      //sendResponse({ html: document.all[0].outerHTML, title: document.title });
    }
    sendResponse({ html: document.all[0].outerHTML, title: document.title });
    return true;
    //return Promise.resolve({ html: document.all[0].outerHTML, title: document.title });
});


console.log("hello!");




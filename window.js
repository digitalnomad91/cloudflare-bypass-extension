
let loadTime = new Date();
let manifest = browser.runtime.getManifest();




const hasAllUrlsPermission = () => {
  return browser.permissions.getAll()
      .then(permissions => permissions.origins.indexOf("<all_urls>") > - 1);
}
hasAllUrlsPermission();



var i = 0;
setInterval(function() {
  i++;
  console.log("wtf..."+i);
  if(typeof(HTML) != "undefined") alert(HTML);
}, 1000);

function getCurrentWindow() {
  return browser.windows.getCurrent();
}


document.addEventListener("click", async (e) => {



  if (e.target.id === "window-update-size_768") {
    await openMyPage();
    await sleep(5);

   // const gettingCurrent = browser.tabs.getCurrent();
    //gettingCurrent.then(onGot, onError);


    getCurrentWindow().then((currentWindow) => {
      console.log(currentWindow);
      //currentWindow.location = ('https://bscscan.com/contractsVerified');
      //browser.windows.update(currentWindow.id, updateInfo);
    });
  }

  if (e.target.id === "window-update-minimize") {
    getCurrentWindow().then((currentWindow) => {
      let updateInfo = {
        state: "minimized"
      };

      browser.windows.update(currentWindow.id, updateInfo);
    });
  }

  else if (e.target.id === "window-create-normal") {
    let createData = {};
    let creating = browser.windows.create(createData);
    creating.then(() => {
      console.log("The normal window has been created");
    });
  }


  e.preventDefault();
});

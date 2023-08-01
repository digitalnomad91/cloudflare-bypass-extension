# CloudFlare Smasher

Working implementation of this 3rd patch for undetect_chromedriver (single python file):
https://github.com/digitalnomad91/udetect_coudflare_working_patch/

Here is the latest version of flaresolverr with this fix implemented: 
https://github.com/digitalnomad91/FlareSolverr-udetect-patch/ 

Note: I haven't tested running it through a new docker image / container, but it should work just fine. I'll include a systemd service implementation for those that want to run it standalone.

Original issue that started several weeks ago:
https://github.com/FlareSolverr/FlareSolverr/issues/811

Still waiting on this (seemingly) more robust method to be implemented & released:
https://github.com/ultrafunkamsterdam/undetected-chromedriver/discussions/1420

## What it does

This extension will automatically open up a cloudflare protected page of your choice periodically in whatever interval you'd like, and then it will get the src code of the page once it's loaded & send it to a webserver that can  then save the contents & serve it up to any other processes that need it. It's a bit crude and could use some cleaning up / improvements, but it worked well enough to get me through the periods where flaresolverr & undetect_chromedriver stopped working.

# How to use it

First to run the extension make sure you copy either the firefox v2 manifest file into manifest.json if you want to use Firefox, and then run:

```npm install```

then:

```web-ext run --devtools```

 Or if you want to run it with Chrome/Chromium then make sure to copy the chrome manifest file into manifest.json and run:

 web-ext run --devtools -t chromium 

 Note: Make sure you complete the following config steps before starting the web-ext utility above.

# Configuration

Make sure you edit each manifest.json file and include any domain names that you will be using in the list with proper wildcards. 

Modify the background.js file and update the discord webhook URL if you want notifications in a discord channel, and then make sure you update the proxyurl/write endpoint, as well as any other URL's in the file that point to any images, or the actual page that you're trying to bypass.

# Important

As of 8/1/23 I managed to put together a working implementation of undetect_chromedriver with a new patch/workaround:

https://github.com/digitalnomad91/udetect_coudflare_working_patch

This same workaround implemented in the latest FlareSolverr:

https://github.com/digitalnomad91/FlareSolverr-udetect-patch

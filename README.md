# CloudFlare Smasher

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

Here's an example systemd config to keep webserver.js running:

```
[Service]
ExecStart=/home/digitalnomad91/.nvm/versions/node/v18.16.0/bin/node /path/to/webserver.js
Restart=always
StandardOutput=file:/var/log/cloudflare_proxy.log
StandardError=file:/var/log/cloudflare_proxy.error.log
User=digitalnomad91
Group=digitalnomad91
Environment=NODE_ENV=production


[Install]
WantedBy=multi-user.target
```
You can mess around with it and get it running with TLS there, but I recommend just using an nginx reverse proxy instead.

```
upstream webserverProxy {
        server 0.0.0.0:3004;
}

server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name <yoursite.com>;

        error_page 400 401 403 404 /none.html;

        location = /none.html {
                root /usr/share/nginx/html/;
                internal;
        }

        if ($scheme = http) {
                return 301 https://$server_name$request_uri;
        }

         ssl on;
        ssl_certificate /etc/letsencrypt/live/<yoursite.com>/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/<yoursite.com>/privkey.pem; # managed by Certbot


        location / {
                proxy_pass http://webserverProxy;
                proxy_http_version 1.1;
                add_header Access-Control-Allow-Origin *;
                proxy_set_header Access-Control-Allow-Origin *;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection upgrade;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
        }
}

```

# Important

As of 8/1/23 I managed to put together a working implementation of undetect_chromedriver with a new patch/workaround:

https://github.com/digitalnomad91/udetect_coudflare_working_patch

This same workaround implemented in the latest FlareSolverr:

https://github.com/digitalnomad91/FlareSolverr-udetect-patch/

-------------------------------------------------

Original issue that started several weeks ago:
https://github.com/FlareSolverr/FlareSolverr/issues/811

Still waiting on this (seemingly) more robust method to be implemented & released:
https://github.com/ultrafunkamsterdam/undetected-chromedriver/discussions/1420

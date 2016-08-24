# Bootstrap Baqend Starter Kit
With this starter project you can easily build application based on:

- [Bootstrap](http://getbootstrap.com/) for a responsive, easy-to-use frontend
- [Baqend](http://www.baqend.com/) for hosting the application, storing data, managing users and executing server-side logic
- [Handlebars](http://handlebarsjs.com/) for templating and arranging your HTML in the client
- [Less](http://lesscss.org/) for powerfull CSS styling
- [Gulp](http://gulpjs.com/) for building, deploying and live-reloading

## How to use it

    $ git clone git@github.com:Baqend/bootstrap-starter.git
    $ cd bootstrap-starter
    $ npm install
    
After, run

    $ gulp
    
...for a local server with live-reloading anytime you change a file: [http://localhost:8888](http://localhost:8888)

If gulp cannot be found, you need to install it globally with `npm install -g gulp` or if you do not want to install gulp globally `npm run gulp`. If you do not have npm installed, [get it here](https://nodejs.org/en/).

## Connect to Baqend

By default this start connects to `toodle` the instance of the [Baqend tutorial](http://www.baqend.com/#tutorial). To change this go to app > js > main.js and change

```javascript
var app = 'toodle';
DB.connect(app);
```

to match your Baqend app. If you do not have one yet, start [one for free](https://dashboard.baqend.com/register).

The [Baqend guide](http://www.baqend.com/guide/) explains everything else you need to know.

## Deploy
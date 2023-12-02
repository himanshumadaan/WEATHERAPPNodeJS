const http = require("http");
const fs = require("fs");
var requests = require('requests');

const indexFile = fs.readFileSync("index.html", "utf-8");
const replaceval = (tempVal, orgVal) => {

    let tempeature = tempVal.replace("{%tempvalue%}", orgVal.main.temp);
    tempeature = tempeature.replace("{%tempmin%}", orgVal.main.temp_min);
    tempeature = tempeature.replace("{%tempmax%}", orgVal.main.temp_max);
    tempeature = tempeature.replace("{%location%}", orgVal.name);
    tempeature = tempeature.replace("{%country%}", orgVal.sys.country);
    tempeature = tempeature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return tempeature;
};
const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=panipat&units=metric&appid=99204cc4bd33e69d5d5b777beb8f05b1"
        )
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata]
                const realTimeData = arrData.map((val) => replaceval(indexFile, val))
                    .join("");
                res.write(realTimeData);
                console.log(realTimeData);
                // console.log(arrData [0].main.temp);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();


            });

    }
    else {
        res.end("file not find");
    }

});

server.listen(3900, "127.0.0.1");

!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=6)}([function(e,n,t){"use strict";function r(e,n){return new Promise(function(t,r){var o=[];c.MongoClient.connect(a,function(i,s){if(i)console.error(i);else{s.collection("wse").findOne({date:n},function(n,i){if(n)console.error(n),r();else{if(console.log("Result:"),!i.data)throw"No data";for(var u=0,c=i.data;u<c.length;u++){var a=c[u];-1!==a.indexOf("T2,"+e)&&o.push(a)}}s.close(),t(o)})}})})}function o(){return new Promise(function(e,n){u.readFile("build/data.txt","utf8",function(t,r){t?n(t):e(r.split("\n"))})})}function i(e){for(var n=u.createWriteStream("datax.txt",{flags:"a"}),t=0,r=e;t<r.length;t++){var o=r[t];n.write(o+"\n")}}function s(e){for(var n=[],t=Number(e[0].split(",")[5]),r=0,o=e;r<o.length;r++){var i=o[r],s=i.split(","),u=Number(s[5]),c=s[2];"090000"!==c&&c<"170000"&&n.push({value:(u-t)/t*100*100,volume:Number(s[6]),time:c})}return n}Object.defineProperty(n,"__esModule",{value:!0});var u=t(7),c=t(8),a=process.env.MONGO_URL||"";n.getStringDataFromMongo=r,n.getStringDataFromFile=o,n.saveDataToFile=i,n.transformData=s},function(e,n){e.exports=require("child_process")},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("uws")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t(1),o=t(2),i=t(3),s=t(4),u=t(5),c=t(0),a=o();a.use("/",o.static(s.join(__dirname,"client"))),a.get("/*",function(e,n){return n.sendFile(s.join(__dirname,"client","index.html"))});var f=i.createServer(a),l=new u.Server({server:f}),d=process.env.PORT||"8080";f.listen(d,function(){return console.log((new Date).toString().split(" ")[4]+" - Server is listening on port "+f.address().port)});var g,p,m=r.fork("build/ml.js");c.getStringDataFromFile().then(function(e){return c.transformData(e)}).then(function(e){g=JSON.stringify(e)}),l.on("connection",function(e){function n(){m.send("RU"),setTimeout(function(){return n()},1e4)}e.send(JSON.stringify({running:!(!m||!m.connected)})),void 0!==g&&e.send(g),void 0!==p&&e.send(p),void 0!==m&&m.on("message",function(n){e.send(n)}),e.on("message",function(t){switch(t.substring(0,2)){case"ST":m.send("CO"+JSON.stringify({config:t.substring(2),inputData:g})),m.on("message",function(n){p=n,console.log("otrzymano message from worker"),e.send(n)}),m.on("exit",function(){return console.log("Process got killed")}),e.send(JSON.stringify({running:!(!m||!m.connected)})),n();break;case"SP":m.kill(),setTimeout(function(){return e.send(JSON.stringify({running:!(!m||!m.connected)}))},100)}})})},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("mongodb")}]);
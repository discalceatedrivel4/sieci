!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=1)}([function(e,n){e.exports=require("fs")},function(e,n,t){"use strict";function r(e){if(v=e,console.log("Data received from worker"),g.broadcast("ST"+e),m){s.createWriteStream("build/"+m).write(e)}}Object.defineProperty(n,"__esModule",{value:!0});var o=t(2),i=t(3),s=t(0),a=t(4),u=t(5),c=t(6),l=t(7),f=i();f.use("/",i.static(u.join(__dirname,"client"))),f.get("/*",function(e,n){return n.sendFile(u.join(__dirname,"client","index.html"))});var d=a.createServer(f),g=new c.Server({server:d}),p=process.env.PORT||"8080";d.listen(p,function(){return console.log((new Date).toString().split(" ")[4]+" - Server is listening on port "+d.address().port)});var v,m,h=[],S=[];l.readFilenamesInDirectory("build/data").then(function(e){for(var n=0,t=e;n<t.length;n++){var r=t[n];!function(e){l.getStringDataFromFile("build/data/"+e).then(function(e){return l.transformData(e)}).then(function(n){if(0!==n.length){var t="PZU - "+e.substring(0,e.length-4);h.push({desc:t,data:n}),S.push(t)}})}(r)}});var O=!1,b=o.fork("build/ml.js");b.on("message",r),b.on("exit",function(){console.log("Process got killed"),process.exit(1)}),g.on("connection",function(e){e.send("RU"+JSON.stringify({running:O})),0!==S.length&&e.send("NA"+JSON.stringify(S)),void 0!==v&&e.send("ST"+v),e.on("message",function(n){switch(n.substring(0,2)){case"ST":var t=JSON.parse(n.substring(2));m=t.options.fileName,"fresh"===t.options.startMode?(t.options.inputValue="",b.send(JSON.stringify({configData:t,inputData:h})),O=!0,e.send("RU"+JSON.stringify({running:O}))):"file"===t.options.startMode?s.readFile("build/"+m,"utf8",function(n,r){n?console.error(n):(t.options.inputValue=r,b.send(JSON.stringify({configData:t,inputData:h})),O=!0,e.send("RU"+JSON.stringify({running:O})))}):(b.send(JSON.stringify({configData:t,inputData:h})),O=!0,e.send("RU"+JSON.stringify({running:O})));break;case"SP":process.exit(1),b.kill(),O=!1,setTimeout(function(){return e.send("RU"+JSON.stringify({running:O}))},100);break;case"DA":for(var r=n.substring(2),o=0,i=h;o<i.length;o++){var a=i[o];if(a.desc===r){e.send("IN"+JSON.stringify(a));break}}}})}),process.env.AUTORUN&&setTimeout(function(){s.readFile("build/data.txt","utf8",function(e,n){if(e)console.error(e);else{var t={options:{}};t.options.inputValue=n,b.send(JSON.stringify({configData:t,inputData:h})),O=!0}})},3e4),process.env.URL&&setInterval(function(){console.log("Anti-idler"),a.get(process.env.url)},15e5)},function(e,n){e.exports=require("child_process")},function(e,n){e.exports=require("express")},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("uws")},function(e,n,t){"use strict";function r(e){f.MongoClient.connect(d,function(n,t){if(n)console.error(n);else{t.collection("wse").find({date:{$gte:e}}).toArray(function(e,n){if(e)console.error(e);else{if(console.log("Result:"),console.log(n),!n.length||0===n.length)throw"No data";for(var r=0,o=n;r<o.length;r++){var i=o[r];u("src/data/dump/"+i.date+".txt",i.data)}}t.close()})}})}function o(e,n){return new Promise(function(t,r){var o=[];f.MongoClient.connect(d,function(i,s){if(i)console.error(i);else{s.collection("wse").findOne({date:n},function(n,i){if(n)console.error(n),r();else{if(console.log("Result:"),!i.data)throw"No data";for(var a=0,u=i.data;a<u.length;a++){var c=u[a];-1!==c.indexOf("T2,"+e)&&o.push(c)}}s.close(),t(o)})}})})}function i(e){return new Promise(function(n,t){l.readdir(e,function(e,r){e?t(e):n(r)})})}function s(e,n){for(var t=[],r=0,o=e;r<o.length;r++){var i=o[r];-1!==i.indexOf("T2,"+n)&&t.push(i)}return t}function a(e){return new Promise(function(n,t){l.readFile(e,"utf8",function(e,r){e?t(e):n(r.split("\n"))})})}function u(e,n){for(var t=l.createWriteStream(e,{flags:"a"}),r=0,o=n;r<o.length;r++){var i=o[r];t.write(i+"\n")}}function c(e){var n=[],t=Number(e[0].split(",")[5]),r=e[0].split(",")[2],o=e[e.length-1].split(",")[2];if("090000"!==r||o<"170000")return n;for(var i=0,s=e;i<s.length;i++){var a=s[i],u=a.split(","),c=Number(u[5]),l=u[2];"090000"!==l&&l<"170000"&&n.push({value:(c-t)/t*100*100,volume:Number(u[6]),time:l})}return n}Object.defineProperty(n,"__esModule",{value:!0});var l=t(0),f=t(8),d=process.env.MONGO_URL||"";n.getAllDataFromMongoSince=r,n.getStringDataFromMongo=o,n.readFilenamesInDirectory=i,n.chooseDataOfStock=s,n.getStringDataFromFile=a,n.saveDataToFile=u,n.transformData=c},function(e,n){e.exports=require("mongodb")}]);
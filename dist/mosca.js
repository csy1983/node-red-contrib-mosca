!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n(require("mosca"));else if("function"==typeof define&&define.amd)define(["mosca"],n);else{var t=n("object"==typeof exports?require("mosca"):e.mosca);for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(this,function(e){return function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};return n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=5)}([function(e,n,t){function o(e){return t(r(e))}function r(e){var n=s[e];if(!(n+1))throw new Error("Cannot find module '"+e+"'.");return n}var s={"./en-US/mosca.json":4};o.keys=function(){return Object.keys(s)},o.resolve=r,e.exports=o,o.id=0},function(e,n,t){e.exports=t.p+"41ef0c71ff1ff8e3f94220de841c00fd.html"},function(e,n,t){e.exports=t.p+"a2d9636200e66d1d9c6f72d198918300.png"},function(e,n){e.exports=require("mosca")},function(e,n,t){e.exports=t.p+"locales/en-US/mosca.json"},function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=t(3),s=o(r);t(1),t(2),t(0),e.exports=function(e){function n(n){var t=this;e.nodes.createNode(this,n);var o={port:n.port},r=e.nodes.getNode(n.backend);if(r&&"mongo"===r.backendType){if(!r.mongo)return void this.status({fill:"red",shape:"ring",text:"Invalid Configuration"});o.backend={type:"mongo",url:r.mongo.url,pubsubCollection:r.mongo.pubsubCollection}}var i=new s.default.Server(o),c=0;i.on("error",function(e){t.status({fill:"red",shape:"ring",text:"Error"}),t.send({status:"error",error:e})}),i.on("ready",function(){t.status({fill:"green",shape:"dot",text:"Ready"}),t.send({status:"ready",message:"Mosca mqtt broker is up and running"})}),i.on("published",function(e,o){t.send({status:"published",config:n,client:o,packet:e})}),i.on("clientConnected",function(e){++c,t.status({fill:"green",shape:"dot",text:c+" client"+(c>1?"s":"")+" connected"}),t.send({status:"clientConnected",client:e})}),i.on("clientDisconnected",function(e){--c,t.status({fill:"green",shape:"dot",text:c+" client"+(c>1?"s":"")+" connected"}),t.send({status:"clientDisconnected",client:e})}),this.on("input",function(e){i.publish(e,function(){t.send({status:"publish",message:e})})}),this.on("close",function(){i.close()})}function t(n){e.nodes.createNode(this,n),this.backendType=n.backend_type,this.mongo={url:n.backend_mongo_url,pubsubCollection:n.backend_mongo_pubsub_collection}}e.nodes.registerType("mosca-backend",t),e.nodes.registerType("mosca",n)}}])});
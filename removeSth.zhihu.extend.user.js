// ==UserScript==
// @name         removeSth.zhihu.extend
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       wongchance
// @match        https://www.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/removeSth.zhihu.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/removeSth.zhihu.extend.user.js
// ==/UserScript==

(function() {
  'use strict'
  jQuery(document).ready(function() {

      var interalTimer = setInterval(function(){
          try{
              $('.Modal-closeButton').click();
              $('svg.ZDI--Xmark16').parent().remove();
              $('div.css-1hwwfws').parent().remove();
             }catch(e){}
      },1000)
  })

})()

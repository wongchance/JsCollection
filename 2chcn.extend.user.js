// ==UserScript==
// @name         2chcn.extend.user
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        http://2chcn.com*
// @match        https://2chcn.com*
// @match        http://2chcn.com/page*
// @match        https://2chcn.com/page*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/2chcn.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/2chcn.extend.user.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict';
  jQuery(document).ready(function () {
    jQuery('img[src="/img/hy.gif"').parent().parent().parent().parent().hide()
    setTimeout(function () { 
    }, 500);

  });
})();
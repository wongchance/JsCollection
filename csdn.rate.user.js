// ==UserScript==
// @name         auto.rate.csdn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://download.csdn.net/download/*
// @match        https://download.csdn.net/my/downloads*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/csdn.rate.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/csdn.rate.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict';
  jQuery(document).ready(function () {

    var url = document.documentURI;
    var msg = '感谢分享~~~~~~~~~~';

    if (url.indexOf('.net/download') > -1) {

      if (jQuery('#star').length > 0) {
        jQuery('#star').next('.stats').children().eq(4).click();
        jQuery('#cc_body').val(msg);
      }

      setTimeout(function () {
        CC_Comment.postComment();
        setTimeout(function () {
          window.close();
        }, 200);
      }, 1000);


    } else if (url.indexOf('.net/my/downloads') > -1) {

      jQuery('.item.uresource').find('li').each(function (index, n) {
        if (jQuery(n).find('.flag.off').length > 0) {
          jQuery(n).hide();
        }
      });

    }

  });
})();
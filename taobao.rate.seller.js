// ==UserScript==
// @name         auto.rate.seller
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://rate.taobao.com/remark_seller.jhtml*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/taobao.rate.seller.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/taobao.rate.seller.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict';
  jQuery(document).ready(function () {
    jQuery('input.good-rate').click();

    var msg = '以前在天猫淘宝上买东西，都是系统自动好评，花了有好多好多钱，后来才知道淘宝评论得积分可以涨淘气值时，才知道评论的重要性，所以以后无论买什么东西，我都先把这段话复制粘贴下来，然后再写宝贝评论，没错，评论80个字以上就可以获得50个积分。';
    jQuery('div.rate-msg-box').find('textarea').val(msg);


    setTimeout(function () {
      jQuery('ul.stars li').find('span.ks-simplestar').each(function () {
        jQuery(this).children("img:last-child").click();
      });
    }, 500);

  });
})();
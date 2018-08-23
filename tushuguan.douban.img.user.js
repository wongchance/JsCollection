// ==UserScript==
// @name         tushuguan.douban.img
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        http://*/opcs/custom*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/tushuguan.douban.img.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/tushuguan.douban.img.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict';
  jQuery(document).ready(function () {


    imgRefresh();

    $('div.zdygn').children().eq(2).click(function () {
      searchOnDouban();
      imgRefresh();
    });
    //.attr('href', 'javascript:searchOnDouban();imgRefresh();');

  });

  function imgRefresh() {
    setTimeout(function () {
      $('li[name="commend"]').find('img').each(function (i, n) {
        var $li = $(this);
        $.ajax({
          url: "http://saturn.51vip.biz:7015/sydp.api.pci//api/Token/Image?imgUrl=" + $(this).attr('src'),
          // data: {
          //   "imgUrl": $(this).attr('src')
          // },
          sync: true,
          type: "post",
          success: function (data) {
            $li.attr('src', data.Data[0]);
          }
        });
      });
    }, 1000);
  }

})();
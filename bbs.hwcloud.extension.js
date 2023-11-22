// ==UserScript==
// @name         bbs.hwcloud.extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://bbs.huaweicloud.com/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var nowtime = 0;
  var intervalNum;
  const endtime = 5;
  const contentText = "盖楼";

  var idoc;

  jQuery(document).ready(function () {
    var url = document.documentURI;

    if (url.indexOf("forum/thread-") > -1) {
      var iframeid = jQuery("iframe[id^=ueditor]")[0].id;
      var iframe = document.getElementById(iframeid);
      var iwindow = iframe.contentWindow;
      idoc = iwindow.document;
      // console.log(inputs)
      var timeIntervalTimesHtml = document.createElement("input");
      timeIntervalTimesHtml.id = "timeIntervalTimes";
      jQuery("td.pls div.favatar p.postNum").after(timeIntervalTimesHtml);

      var timeIntervalHtml = document.createElement("a");
      timeIntervalHtml.innerHTML = "定时发";
      timeIntervalHtml.id = "timeInterval";
      timeIntervalHtml.classList.add("repThe");
      jQuery("td.pls div.favatar p.postNum").after(timeIntervalHtml);
      timeIntervalHtml.addEventListener("click", do_timeInterval);

      // var selectallHtml = document.createElement('a');
      // selectallHtml.innerHTML = '全選';
      // selectallHtml.id = 'selectall';
      // selectallHtml.classList.add('weui_btn');
      // selectallHtml.classList.add('weui_btn_mini');
      // selectallHtml.classList.add('weui_btn_primary');
      // selectallHtml.style.cssText = 'margin-left: 5px';
      // selectallHtml.setAttribute('href', 'javascript:void(0);');
      // jQuery('#push_button').after(selectallHtml);
      // selectallHtml.addEventListener('click', do_selectall);
    } else {
      // vol.moe/list   分页按钮class
    }
  });

  function do_timeInterval() {
    nowtime=0;
    submitContent();
    intervalNum = setInterval(() => {
      submitContent();
    }, 31 * 1000);
  }

  function submitContent() {
    if (nowtime <= endtime) {
      nowtime++;
      jQuery(idoc).find("body.view").html(
        "<p>" + contentText + nowtime + "</p>");
      jQuery("#timeIntervalTimes").val(nowtime);
      if (jQuery(idoc).find("body.view").html()) {
        //alert(jQuery(idoc).find("body.view").html());
        jQuery("#fastpostsubmit").click();
      }
    } else {
      clearInterval(intervalNum);
    }
  }
})();

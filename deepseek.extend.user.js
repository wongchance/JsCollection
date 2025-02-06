// ==UserScript==
// @name         deepseek.extend.user
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://chat.deepseek.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/deepseek.extend.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/deepseek.extend.user.js
// ==/UserScript==

;(function () {
  'use strict'
  jQuery(document).ready(function () {
    console.log(jQuery('rect#重新生成'))
    setInterval(() => {
      //如果当前页面包含文本“服务器繁忙，请稍后再试。”，do sth
      if (document.body.innerText.indexOf('服务器繁忙，请稍后再试。') !== -1) {
        console.log('服务器繁忙，请稍后再试。')
        jQuery('rect#重新生成').last().parent().parent().click()
      }
    }, 1000)
  })
})()
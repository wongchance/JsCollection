// ==UserScript==
// @name         sg.new.creater
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://www.steamgifts.com/giveaways/new
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/sg.new.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/sg.new.user.js
// @grant        none
// ==/UserScript==


(function () {
  'use strict';
  jQuery(document).ready(function () {


    jQuery('div.form__row--giveaway-type').find('div[data-checkbox-value="key"]').click();


    setTimeout(function () {
      $("#ui-datepicker-div").remove();
      $('input[name="start_time"]').blur();
      $('input[name="start_time"]').focus();
      $('button.ui-datepicker-current').click();
      $('button.ui-datepicker-close').click();


    }, 500);


    setTimeout(function () {
      $("#ui-datepicker-div").remove();
      $('input[name="end_time"]').blur();
      $('input[name="end_time"]').focus();
      $('button.ui-datepicker-current').click();
      $('button.ui-datepicker-close').click();

    }, 1000);


    jQuery('input[name="country_item_string"]').eq(0).next().children().eq(1).click();


    jQuery('div[data-checkbox-value="everyone"]').children().eq(1).click();

    jQuery('input[name="contributor_level"]').val(2);
    jQuery('div.form__slider').children().eq(0).css("width", "20%");
    jQuery('div.form__slider').children().eq(1).css("left", "20%");

  });
})();
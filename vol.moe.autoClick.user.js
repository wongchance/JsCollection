// ==UserScript==
// @name         autoclick
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  try to take over the world!
// @author       wongchance
// @match        http://vol.moe/comic/*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/vol.moe.autoClick.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/vol.moe.autoClick.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    jQuery(document).ready(function () {

        //console.log(inputs);
        //var selectallHtml = '<a href="javascript:void(0);" onclick="do_selectall();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectall" style="margin-left: 5px;">全選</a>';
        //var selectnoneHtml = '<a href="javascript:void(0);" onclick="do_selectnone();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectnone" style="margin-left: 5px;">全不選</a>';
        //var selectreverseHtml = '<a href="javascript:void(0);" onclick="do_selectreverse();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectreverse" style="margin-left: 5px;">反選</a>';
        // jQuery('#push_button').after(selectreverseHtml);
        // jQuery('#push_button').after(selectnoneHtml);
        // jQuery('#push_button').after(selectallHtml);

        var selectreverseHtml = document.createElement('a');
        selectreverseHtml.innerHTML = "反選";
        selectreverseHtml.id = 'selectreverse';
        selectreverseHtml.classList.add('weui_btn');
        selectreverseHtml.classList.add('weui_btn_mini');
        selectreverseHtml.classList.add('weui_btn_primary');
        selectreverseHtml.style.cssText = 'margin-left: 5px';
        selectreverseHtml.setAttribute('href', 'javascript:void(0);');
        jQuery('#push_button').after(selectreverseHtml);
        selectreverseHtml.addEventListener('click', do_selectreverse);


        var selectnoneHtml = document.createElement('a');
        selectnoneHtml.innerHTML = "全不選";
        selectnoneHtml.id = 'selectnone';
        selectnoneHtml.classList.add('weui_btn');
        selectnoneHtml.classList.add('weui_btn_mini');
        selectnoneHtml.classList.add('weui_btn_primary');
        selectnoneHtml.style.cssText = 'margin-left: 5px';
        selectnoneHtml.setAttribute('href', 'javascript:void(0);');
        jQuery('#push_button').after(selectnoneHtml);
        selectnoneHtml.addEventListener('click', do_selectnone);


        var selectallHtml = document.createElement('a');
        selectallHtml.innerHTML = "全選";
        selectallHtml.id = 'selectall';
        selectallHtml.classList.add('weui_btn');
        selectallHtml.classList.add('weui_btn_mini');
        selectallHtml.classList.add('weui_btn_primary');
        selectallHtml.style.cssText = 'margin-left: 5px';
        selectallHtml.setAttribute('href', 'javascript:void(0);');
        jQuery('#push_button').after(selectallHtml);
        selectallHtml.addEventListener('click', do_selectall);

        // jQuery('#push_button').after(selectreverseHtml);
        // jQuery('#push_button').after(selectnoneHtml);
        // jQuery('#push_button').after(selectallHtml);

    });



    function do_selectall() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            if (jQuery(inputs[i]).prop('checked') == true) {
            } else {
                jQuery(inputs[i]).click();
            }
        }
    }

    function do_selectnone() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            if (jQuery(inputs[i]).prop('checked') == true) {
                jQuery(inputs[i]).click();
            } else {
            }
        }
    }

    function do_selectreverse() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            jQuery(inputs[i]).click();
        }
    }

})();


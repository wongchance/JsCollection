// ==UserScript==
// @name         vol.moe.extension
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        http://vol.moe/comic/*
// @match        http://vol.moe/list/*
// @match        https://vol.moe/comic/*
// @match        https://vol.moe/list/*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/vol.moe.extension.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/vol.moe.extension.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

;
(function () {
    'use strict';
    jQuery(document).ready(function () {
        var url = document.documentURI;

        if (url.indexOf('vol.moe/comic') > -1) {
            // console.log(inputs)
            // var selectallHtml = '<a href="javascript:void(0);" onclick="do_selectall();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectall" style="margin-left: 5px;">全選</a>'
            // var selectnoneHtml = '<a href="javascript:void(0);" onclick="do_selectnone();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectnone" style="margin-left: 5px;">全不選</a>'
            // var selectreverseHtml = '<a href="javascript:void(0);" onclick="do_selectreverse();" class="weui_btn weui_btn_mini weui_btn_primary" id="selectreverse" style="margin-left: 5px;">反選</a>'
            // jQuery('#push_button').after(selectreverseHtml)
            // jQuery('#push_button').after(selectnoneHtml)
            // jQuery('#push_button').after(selectallHtml)

            var selectreverseHtml = document.createElement('a');
            selectreverseHtml.innerHTML = '反選';
            selectreverseHtml.id = 'selectreverse';
            selectreverseHtml.classList.add('weui_btn');
            selectreverseHtml.classList.add('weui_btn_mini');
            selectreverseHtml.classList.add('weui_btn_primary');
            selectreverseHtml.style.cssText = 'margin-left: 5px';
            selectreverseHtml.setAttribute('href', 'javascript:void(0);');
            jQuery('#push_button').after(selectreverseHtml);
            selectreverseHtml.addEventListener('click', do_selectreverse);

            var selectnoneHtml = document.createElement('a');
            selectnoneHtml.innerHTML = '全不選';
            selectnoneHtml.id = 'selectnone';
            selectnoneHtml.classList.add('weui_btn');
            selectnoneHtml.classList.add('weui_btn_mini');
            selectnoneHtml.classList.add('weui_btn_primary');
            selectnoneHtml.style.cssText = 'margin-left: 5px';
            selectnoneHtml.setAttribute('href', 'javascript:void(0);');
            jQuery('#push_button').after(selectnoneHtml);
            selectnoneHtml.addEventListener('click', do_selectnone);

            var selectallHtml = document.createElement('a');
            selectallHtml.innerHTML = '全選';
            selectallHtml.id = 'selectall';
            selectallHtml.classList.add('weui_btn');
            selectallHtml.classList.add('weui_btn_mini');
            selectallHtml.classList.add('weui_btn_primary');
            selectallHtml.style.cssText = 'margin-left: 5px';
            selectallHtml.setAttribute('href', 'javascript:void(0);');
            jQuery('#push_button').after(selectallHtml);
            selectallHtml.addEventListener('click', do_selectall);

            var commentGoTd = document.createElement('td');

            var commentIndexHtml = document.createElement('input');
            commentIndexHtml.id = 'commentPageIndex';
            commentIndexHtml.style.cssText = 'margin-left: 15px;width: 35px;';
            commentGoTd.appendChild(commentIndexHtml);

            var commentGoHtml = document.createElement('a');
            commentGoHtml.innerHTML = 'Go';
            commentGoHtml.id = 'commentGo';
            commentGoHtml.style.cssText = 'margin-left: 5px';
            commentGoHtml.setAttribute('href', 'javascript:void(0);');
            commentGoHtml.setAttribute('onclick', 'commlist_page(document.getElementById("commentPageIndex").value);');
            commentGoTd.appendChild(commentGoHtml);

            jQuery('#book_comm_title').after(commentGoTd);
            // selectallHtml.addEventListener('click', do_selectall)
            jQuery('#book_comm_title').width('50%');
            // jQuery('#push_button').after(selectreverseHtml)
            // jQuery('#push_button').after(selectnoneHtml)
            // jQuery('#push_button').after(selectallHtml)
        } else { // vol.moe/list   分页按钮class
            var aArr = jQuery('a.weui_btn.weui_btn_mini.weui_btn_default');
            // jQuery('#book_comm_title');
            var urlArr = url.split('/');
            var urlArrLast = urlArr[urlArr.length - 1];
            if (urlArrLast.indexOf('.htm') > -1) {
                var pageIndex = urlArrLast.split('.')[0];
                if (pageIndex.length == 1) {
                    pageIndex = '0' + pageIndex;
                }
                for (var m = 0; m < aArr.length; m++) {
                    if (jQuery(aArr[m])[0].innerText == pageIndex) {
                        jQuery(aArr[m]).addClass('weui_btn_primary');
                    }
                }
            } else { // 01
                for (var n = 0; n < aArr.length; n++) {
                    if (jQuery(aArr[n])[0].innerText == '01') {
                        jQuery(aArr[n]).addClass('weui_btn_primary');
                    }
                }
            }
        }
    });

    function do_selectall() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            if (jQuery(inputs[i]).prop('checked') == true) {} else {
                jQuery(inputs[i]).click();
            }
        }
    }

    function do_selectnone() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            if (jQuery(inputs[i]).prop('checked') == true) {
                jQuery(inputs[i]).click();
            } else {}
        }
    }

    function do_selectreverse() {
        var inputs = jQuery('#div_mobi').find('input[type="checkbox"]');
        for (var i = 0; i < inputs.length; i++) {
            jQuery(inputs[i]).click();
        }
    }
})();
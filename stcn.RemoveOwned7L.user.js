// ==UserScript==
// @name         Remove owned 7L
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        http://steamcn.com/plugin.php?id=steamcn_gift:search*
// @match        https://steamcn.com/plugin.php?id=steamcn_gift:search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    jQuery(document).ready(function() {

        var urlTmp =window.location.href;

        //$.get("http://steamcn.com/plugin.php?id=steamcn_gift:search&type=7l&q=ending&page=4", function(data){
        //   alert("Data Loaded: " + data);
        //});

        var pageIndex =0;
        pageIndex =parseInt( hasParameter("page"));
        if(!pageIndex)
        {
            urlTmp+='&page=1';
            pageIndex=1;
        }

        var count =parseInt(pageIndex)+10;


        jQuery("div.pg").attr('id','divpg');

        for(var i=pageIndex;i<count;i++)
        {

            urlTmp = replaceParamVal(urlTmp,'page',(i+1));
            $.get(urlTmp, function(data){
                var htmlTmp = data;
                if(htmlTmp.indexOf("d_gw_search_noresult")>-1){console.log(urlTmp);}
                else{
                    var indexBegin = htmlTmp.indexOf("<a href=\"./forum.php?mod=viewthread&amp;tid=");
                    var indexEnd = htmlTmp.indexOf("<div class=\"pg\">");

                    var arrTmp =htmlTmp.substring(indexBegin,indexEnd);
                    //console.log(arrTmp);
                    //console.log(jQuery("#divpg"));
                    
                    
                    //jQuery("#divpg").before(arrTmp);


                    //$.getScript("http://steamdb.sinaapp.com/steam_info.js", function() {
                    //alert("Load was performed.");
                    //jQuery("p.steam_info_trigger_text.steam_info_own").closest('a').css('display','none');
                    //});

                }

                //console.log(urlTmp);
            });

        }



        function receiveMessage(event){
            if(event.data.sub){
                sub = JSON.parse(event.data.sub);
            }else if(event.data.own||event.data.wish){
                console.log(event);
                own = JSON.parse(event.data.own);
                wish = JSON.parse(event.data.wish);
                //ÏÂÃæÕâ¶ÎÓÃÓÚ7L
                jQuery('.steam_info_trigger_text').each(function(){
                    var trigger = jQuery(this);
                    var href = String(trigger.data('href'));
                    var match;
                    if(match == href.match(/\/(store\.steampowered|steamcommunity)\.com\/app\/(\d+)/)){
                        var appid = parseInt(match[2]);
                        if(own.indexOf(appid) !== -1){
                            trigger.addClass('steam_info_own');
                        }else if(wish.indexOf(appid) !== -1){
                            trigger.addClass('steam_info_wish');
                        }
                    }
                });
            }else if(event.data.desura){
                desura = JSON.parse(event.data.desura);
                jQuery('a[href^="http://www.desura.com/games/"]').each(function(){
                    var trigger = jQuery(this);
                    trigger.addClass('linkDesura');
                    var href = String(trigger.attr('href'));
                    var match;
                    if(match == href.match(/\/\/www\.desura\.com(\/[^\/]*\/[^\/#?]*)/)){
                        var url = match[1];
                        url = url.toLowerCase();
                        if(desura.indexOf(url) !== -1){
                            trigger.addClass('linkOwn');
                        }
                    }
                });
            }else{
                var height = event.data.height;
                var src = event.data.src;
                var iframe = jQuery('iframe[src="'+src+'"]').closest('div');
                iframe.height(height+1);
                position(iframe);
            }
        }
        window.addEventListener("message", receiveMessage, false);


        jQuery("p.steam_info_trigger_text.steam_info_own").closest('a').css('display','none');





    });

})();




function hasParameter(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r) return unescape(r[2]); return null;
}


function replaceParamVal(oldUrl, paramName, replaceWith) {
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oldUrl.replace(re, paramName + '=' + replaceWith);
    return nUrl;
}

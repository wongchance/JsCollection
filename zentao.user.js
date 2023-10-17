// ==UserScript==
// @name         zentao
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wongchance
// @match        http://myjob.zjshenyue.cn/*
// @match        https://myjob.zjshenyue.cn/*
// @match        http://www.zjshenyue.cn:83/*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/zentao.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/zentao.user.js
// @grant        none
// ==/UserScript==

;(function () {
  function lastweekfn() {
    var datebefore = getDayByDate(-7, jQuery('#begin').val())
    var dateafter = getDayByDate(-7, jQuery('#end').val())

    var worksummarydatestring = '-' + datebefore + '-' + dateafter + '-'
    var newhref = location.href.replace(
      '-' +
        jQuery('#begin').val().replace('-', '').replace('-', '') +
        '-' +
        jQuery('#end').val().replace('-', '').replace('-', '') +
        '-',
      worksummarydatestring
    )
    location.href = newhref
  }

  function nextweekfn() {
    var datebefore = getDayByDate(7, jQuery('#begin').val())
    var dateafter = getDayByDate(7, jQuery('#end').val())

    var worksummarydatestring = '-' + datebefore + '-' + dateafter + '-'
    var newhref = location.href.replace(
      '-' +
        jQuery('#begin').val().replace('-', '').replace('-', '') +
        '-' +
        jQuery('#end').val().replace('-', '').replace('-', '') +
        '-',
      worksummarydatestring
    )
    location.href = newhref
  }

  ;('use strict')
  // 组织代码,0为全部部门
  var organizeCode = '3'

  function getDayByDate(day, date) {
    var dates = new Date(date)
    dates.setDate(dates.getDate() + day)

    var year = dates.getFullYear()
    var month = dates.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    var today = dates.getDate()
    if (today < 10) {
      today = '0' + today
    }
    return year + '' + month + '' + today
  }

  function getDay(day) {
    // Date()返回当日的日期和时间。
    var days = new Date()
    // getTime()返回 1970 年 1 月 1 日至今的毫秒数。
    var gettimes = days.getTime() + 1000 * 60 * 60 * 24 * day
    // setTime()以毫秒设置 Date 对象。
    days.setTime(gettimes)
    var year = days.getFullYear()
    var month = days.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    var today = days.getDate()
    if (today < 10) {
      today = '0' + today
    }
    return year + '' + month + '' + today
  }

  jQuery(document).ready(function () {
    var url = location.href
    var datenow = getDay(0)
    var datebefore = getDay(-7)
    var dateafter = getDay(7)
    if (url.indexOf('report-worksummary.html') > -1) {
      // console.log('url1', url)
      // http://myjob.zjshenyue.cn/zentao/report-worksummary-20200701-20200828-3.html
      var worksummarydatestring =
        'report-worksummary-' +
        datebefore +
        '-' +
        datenow +
        '-' +
        organizeCode +
        '-assign.html'
      location.href = url.replace(
        'report-worksummary.html',
        worksummarydatestring
      )
    } else if (url.indexOf('report-workload.html') > -1) {
      // console.log('url2', url)
      // http://myjob.zjshenyue.cn/zentao/report-workload-20200828-20200904-5-7.0-3-assign.html
      var workloaddatestring =
        'report-workload-' +
        datenow +
        '-' +
        dateafter +
        '-3-7.0-' +
        organizeCode +
        '-assign.html'
      location.href = url.replace('report-workload.html', workloaddatestring)
    }

    // // if that doesn't work try this
    // jQuery('#appsBar').html(jQuery('#appsBar').html().replace(/迭代/g, '项目'))
    // // jQuery('#apps').html(jQuery('#apps').html().replace(/迭代/g,'项目'));
    // jQuery('#menu').html(jQuery('#menu').html().replace(/迭代/g, '项目'))

    if (url.indexOf('zentao/report-worksummary-') > -1) {
      var lastweekHtml = document.createElement('a')
      lastweekHtml.innerHTML = '上一周'
      lastweekHtml.id = 'lastweek'
      lastweekHtml.classList.add('btn')
      lastweekHtml.classList.add('btn-primary')
      lastweekHtml.style.cssText = 'margin-left: 5px'
      // selectreverseHtml.setAttribute('href', 'javascript:void(0);')
      jQuery('#conditions').find('form').append(lastweekHtml)
      lastweekHtml.addEventListener('click', lastweekfn)

      var nextweekHtml = document.createElement('a')
      nextweekHtml.innerHTML = '下一周'
      nextweekHtml.id = 'nextweek'
      nextweekHtml.classList.add('btn')
      nextweekHtml.classList.add('btn-primary')
      nextweekHtml.style.cssText = 'margin-left: 5px'
      // selectreverseHtml.setAttribute('href', 'javascript:void(0);')
      jQuery('#conditions').find('form').append(nextweekHtml)
      nextweekHtml.addEventListener('click', nextweekfn)

      // jQuery('#conditions').find('form').append('<div class="col-sm-1"><a class="btn btn-primary" id="lastweek" onclick="lastweekfn"> 上一周</a></div>')
      // jQuery('#conditions').find('form').append('<div class="col-sm-1"><a class="btn btn-primary" id="nextweek" onclick="nextweekfn"> 下一周</a></div>')
    } else if (url.indexOf('zentao/report-workload-') > -1) {
      var lastweekHtml2 = document.createElement('a')
      lastweekHtml2.innerHTML = '上一周'
      lastweekHtml2.id = 'lastweek2'
      lastweekHtml2.classList.add('btn')
      lastweekHtml2.classList.add('btn-primary')
      lastweekHtml2.style.cssText = 'margin-left: 5px'
      // selectreverseHtml.setAttribute('href', 'javascript:void(0);')
      jQuery('#conditions').append(lastweekHtml2)
      lastweekHtml2.addEventListener('click', lastweekfn)

      var nextweekHtml2 = document.createElement('a')
      nextweekHtml2.innerHTML = '下一周'
      nextweekHtml2.id = 'nextweek2'
      nextweekHtml2.classList.add('btn')
      nextweekHtml2.classList.add('btn-primary')
      nextweekHtml2.style.cssText = 'margin-left: 5px'
      // selectreverseHtml.setAttribute('href', 'javascript:void(0);')
      jQuery('#conditions').append(nextweekHtml2)
      nextweekHtml2.addEventListener('click', nextweekfn)

      // jQuery('#conditions').find('form').append('<div class="col-sm-1"><a class="btn btn-primary" id="lastweek" onclick="lastweekfn"> 上一周</a></div>')
      // jQuery('#conditions').find('form').append('<div class="col-sm-1"><a class="btn btn-primary" id="nextweek" onclick="nextweekfn"> 下一周</a></div>')
    } else if (url.indexOf('zentao/task-view-') > -1) {
      jQuery('.detail-content th').each(function () {
        var text = $(this).text()
        if (text == '预计开始') {
          var taskstart = $(this).next().text().trim()
          localStorage.setItem('taskstart', taskstart + ' 09:00')
        } else if (text == '截止日期') {
          var taskend = $(this).next().text().trim().split('延期')[0].trim()
          localStorage.setItem('taskend', taskend + ' 17:30')
        } else if (text == '最初预计') {
          var taskspend = $(this).next().text().trim().replace('工时','')
          localStorage.setItem('taskspend', taskspend)
        }
      })
    } else if (url.indexOf('zentao/task-finish-') > -1) {
      jQuery('#realStarted').val(localStorage.getItem('taskstart'))
      jQuery('#finishedDate').val(localStorage.getItem('taskend'))
      jQuery('#currentConsumed').val(localStorage.getItem('taskspend'))
      document.querySelectorAll('#currentConsumed')[0].dispatchEvent(new Event('keyup'))
    }
    else if (url.indexOf('zentao/task-activate-') > -1) {
      jQuery('#left').val(localStorage.getItem('taskspend'))
    }
    // jQuery('a').html(jQuery('a').html().replace(/迭代/g,'项目'));
    // jQuery('li').html(jQuery('li').html().replace(/迭代/g,'项目'));
  })
})()

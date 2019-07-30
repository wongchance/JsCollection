// ==UserScript==
// @name         大麦-wong
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       wongchance
// @match        https://detail.damai.cn/item.htm*
// @match        https://buy.damai.cn/orderConfirm*
// @updateURL    https://github.com/wongchance/JsCollection/raw/master/damai.user.js
// @downloadURL  https://github.com/wongchance/JsCollection/raw/master/damai.user.js
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==

;(function() {
  'use strict'
  // 票数第一第二选项
  var choosenItemIndex = [0, 1]
  // 观影人数
  var ticketCount = 2

  /** 修改配送方式，电子票index=0， 快递票index=1, 自助index=2**/
  // 默认快递票因为不需要再次填写信息
  var index = 1
  /** 修改名字，电话号码**/
  var contact = '王XX'
  var phone = '1XXXXXXXXXX'
  //票刷新
  var refresh_time = 2
  //确认等待1秒
  var wait_time = 1

  var choosenDomArray = []
  jQuery(document).ready(function() {
    var url = document.documentURI
    if (url.indexOf('detail.damai.cn/item.htm') > -1) {
      var timerInterval = setInterval(() => {
        if (
          jQuery('div.select_right_list .select_right_list_item.sku_item')
            .length > 0
        ) {
          clearInterval(timerInterval)
          choosenItemIndex.forEach(element => {
            choosenDomArray.push(
              jQuery(
                'div.select_right_list .select_right_list_item.sku_item'
              ).eq(element)
            )
          })
          console.log('choosenDomArray', choosenDomArray)
          choosenDomArray.forEach(element => {
            var notticket = jQuery(element).find('span.notticket')
            if (notticket.length > 0) {
              console.log(
                jQuery(element)
                  .find('div')
                  .html() + '无票'
              )
            } else {
              for (var j = 1; j < ticketCount; j++) {
                jQuery(
                  'a.cafe-c-input-number-handler.cafe-c-input-number-handler-up'
                ).click()
                //  jQuery('input.cafe-c-input-number-input').val(ticketCount)
              }
              jQuery('div.buybtn').click()
            }
          })
        }
      }, 500)
      setTimeout(() => {
        window.location.href = window.location.href
      }, refresh_time * 1000)
    } else if (url.indexOf('buy.damai.cn/orderConfirm') > -1) {
      console.log('confirm')
      var audio = new Audio(
        'http://audio.marsupialgurgle.com/audio/successtrumpet.mp3'
      )

      //TODO 判断纸质票还是电子票

      var d_method = 'express'

      var methods = ['electron', 'express', 'self']

      var notice = document.createElement('DIV')

      notice.style.lineheight = '30px'
      notice.style.color = 'white'
      notice.style.fontSize = '18px'
      notice.style.padding = '10px 20px'
      notice.style.background = 'green'
      notice.style.position = 'fixed'
      notice.style.left = '30px'
      notice.style.top = '100px'
      notice.style.zIndex = '10000'

      var contact_p = document.createElement('P')
      contact_p.appendChild(document.createTextNode(contact))
      var phone_p = document.createElement('P')
      phone_p.appendChild(document.createTextNode(phone))

      notice.appendChild(contact_p)
      notice.appendChild(document.createElement('BR'))
      notice.appendChild(phone_p)

      var confirm = document.createElement('P')
      confirm.appendChild(document.createTextNode('确认订单'))
      confirm.style.lineheight = '30px'
      confirm.style.color = 'white'
      confirm.style.fontSize = '18px'
      confirm.style.padding = '10px 20px'
      confirm.style.background = 'red'
      confirm.style.position = 'fixed'
      confirm.style.left = '30px'
      confirm.style.top = '200px'
      confirm.style.zIndex = '10000'

      var container = document.querySelector('body')
      container.appendChild(notice)
      container.appendChild(confirm)

      var way_items = document.querySelectorAll('.way-item')

      if (way_items.length > 1) {
        var selector_str = '.way-item.' + methods[index] + ' > .way-image'
        var ele = document.querySelector(selector_str)
        if (ele) {
          ele.click()
        }
      }

      audio.play()

      var inputs = document.querySelectorAll('.delivery-form-row input')

      var persons = document.querySelectorAll(
        '#confirmOrder_1 > div.dm-ticket-buyer > div.ticket-buyer-select > div.next-row.next-row-no-padding.buyer-list > div > label > span.next-checkbox.isFirefox > span'
      )
      console.log(persons)
      if (persons.length !== 0) {
        for (var i = 0; i < persons.length; i++) {
          persons[i].click()
        }
      }
      if (inputs.length === 0) {
        // 不需要填写
        document
          .querySelector('#confirmOrder_1 > div.submit-wrapper > button')
          .click()
      } else {
        // 等待用户输入姓名和电话
        sleep(wait_time * 1000).then(() => {
          document
            .querySelector('#confirmOrder_1 > div.submit-wrapper > button')
            .click()
        })
      }

      confirm.onclick = function() {
        this.style.background = 'grey'
        document
          .querySelector('#confirmOrder_1 > div.submit-wrapper > button')
          .click()
      }
    }
  })
})()

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}


# JsCollection
一些脚本  

# sh shadowsocks
> https://teddysun.com/486.html

```ruby
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/wongchance/JsCollection/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```

# sh bbr
```ruby
yum -y install wget
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh
```

# js 
```ruby
var s = `
systempm
屏蔽昨天 23:00
恭喜你获得了由 jack_lee16 送出的 Chocolate makes you happy 3，点击查看详情，自动发送的奖品为“526LV-AG8ZD-04T5N”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 23:00
恭喜你获得了由 jack_lee16 送出的 Chocolate makes you happy 4，点击查看详情，自动发送的奖品为“QB3I3-6RL30-72QJZ”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 23:00
恭喜你获得了由 jack_lee16 送出的 Chocolate makes you happy 2，点击查看详情，自动发送的奖品为“TF63M-BZM5E-BERAY”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 23:00
恭喜你获得了由 jack_lee16 送出的 Chocolate makes you happy，点击查看详情，自动发送的奖品为“ITJKF-KX83F-E428N”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 22:03
恭喜你获得了由 瓦楞 送出的 熊孩子WildKids，点击查看详情，自动发送的奖品为“BR2PN-8QQY9-8YLKW”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 21:34
恭喜你获得了由 暗夜残影 送出的 Spheroid，点击查看详情，自动发送的奖品为“及时确认，Spheroid V3BQY-TR4IT-VKRBB”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 20:39
恭喜你获得了由 您过去妮妮 送出的 Tilt Brush，点击查看详情，自动发送的奖品为“9C2Q3-BA6Y7-M46JH”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽昨天 18:36
恭喜你获得了由 pouwey 送出的 Farm Mania： Hot Vacation，点击查看详情，自动发送的奖品为“激活码：609K4-7T237-0FT3G”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
`
var reg = /[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}/g; //最后一个g表示要全局匹配
console.log(s.match(reg).toString());//结果ab,ab,ab，ab
```

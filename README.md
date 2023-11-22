
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
恭喜你获得了由 jack_lee16 送出的 aMAZE Dark Times，点击查看详情，自动发送的奖品为“GNAEX-GQFA9-XJ0T2”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽26 分钟前
恭喜你获得了由 jack_lee16 送出的 Chocolate makes you happy 6，点击查看详情，自动发送的奖品为“LTMA5-6AM6V-4K2YY”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽26 分钟前
恭喜你获得了由 jack_lee16 送出的 Bitcoin Collector： Spinners Attack，点击查看详情，自动发送的奖品为“ZW58F-8DL4A-HEWY3”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
systempm
屏蔽半小时前
恭喜你获得了由 1138183370 送出的 All You Can Eat，点击查看详情，自动发送的奖品为“AWAZC-AMBTR-JQ5L7”，如有问题请及时联系楼主，如果没有问题请及时点击帖子中的确认收到按钮
`
var reg = /[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}/g; //最后一个g表示要全局匹配
console.log(s.match(reg).toString());//结果ab,ab,ab，ab
```

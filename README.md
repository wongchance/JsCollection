
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
var aa = `
游戏名Fairy of the treasures【CDKey】HHQVI-HYN23-KF97Z
游戏名Fairy of the treasures - Soundtrack【CDKey】9D7PF-TGPVT-72LFA
游戏名Ice Cream Factory【CDKey】9NH4R-WPI2Y-D69W8
游戏名Jammerball【CDKey】5ZRHY-ZP2MJ-IZAQE
游戏名Falling words【CDKey】J7XEY-4LE6C-49YZJ
游戏名Vzerthos: The Heir of Thunder【CDKey】5B9FD-DBE3C-JGNMT
游戏名Gazzel Quest, The Five Magic Stones【CDKey】BXTQG-0V4W3-PCHML
游戏名The Entity【CDKey】Y0BN3-GPXJ5-D0TNK
游戏名Katie【CDKey】97IRJ-P846D-T9W06
游戏名Katie: Gratitude Pack【CDKey】VJYTH-CGPVH-XW0MW
游戏名PROJECT XINATRA【CDKey】C6FMK-8DAZH-47LX6
游戏名Marwin and The Evolution Stone【CDKey】JG9GF-2IQV4-QQ0R7
游戏名CGWallpapers【CDKey】MPZ98-KHKYX-EI2J2
游戏名Daddy's gone a-hunting【CDKey】405F3-Z4BIM-W5IP3
游戏名SEGFAULT【CDKey】0EFBE-9Y030-KXNVE
`;
var arr = aa.split('\n');
var arr2 = [];
for (var i = 0; i < arr.length; i++) {
    if(arr[i]){
       arr2.push(arr[i].split('激活码')[1]);
    }
}
console.log(arr2.join(',')); 
```

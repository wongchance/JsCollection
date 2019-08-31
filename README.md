
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
卡号：Trump Vs Rocketman	KA305-W9NDQ-3F64E
卡号：Lawnmower Game 4: The Final Cut	NJ0Q0-2TJN8-XL68V
卡号：Gangsta Woman	AD847-V4VVV-DDZ80
卡号：Deep Race: Space	2043G-HZGN7-52K3E
卡号：Elon Must - Road to Respect	AL05Q-ET6AX-03Z66
卡号：Quest For Wartorn Brotherhood	KHFZG-EH34V-NG2XQ
卡号：Cyborg Invasion Shooter 3: Savior Of The World	859VX-M7PYY-J6VGR
卡号：Ball Fall	ADXCQ-HH994-4LXWR
卡号：Gregor Hills Haunted Hospital	FANVN-2J5XE-T6WN5
卡号：Mission XAM	IRDC6-LXJ5L-J5CKJ
卡号：STALINGRAD ABATIS	6NHQJ-F5PAK-86DJZ
卡号：The.Thend.End	KV8T5-43H2J-PYKY2
卡号：LocoSoccer	8PABB-KLZ2D-Y09G4
卡号：Monopolist Technological Revolution	MMIFN-TI4ZI-HV4KB
卡号：SNUSE 221	KGRKY-FKXIR-5IGBD
卡号：Reveal	I65D5-9KYI3-DY9TF
卡号：Invasion	25ZAF-4QM04-MEF3N
卡号：The Resistance	7XDL4-VL4JG-YYB06
卡号：Smash Halloween Pumpkins The Challenge	L62PY-HVWR2-T270L
卡号：The Christmas Gifts	7WG4F-VDR7X-FTN92
`
var reg = /[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}/g; //最后一个g表示要全局匹配
console.log(s.match(reg).toString());//结果ab,ab,ab，ab
```

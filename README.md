# JsCollection
一些脚本


# sh shadowsocks
https://teddysun.com/486.html
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/wongchance/JsCollection/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log

# sh bbr
yum -y install wget
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh


# js

var aa = `
Kamikaze Cube【Key】8LIIV-V7BQ9-Q4F2Q;
Violent Vectors【Key】G8CTM-B6JLX-QYR7E;
Half Past Impossible【Key】ZY5YW-93M5I-CFPVP;
Not Without My Poop【Key】A9C5W-K5X2C-CDBGR;
Galactic Lords【Key】DYFD9-JRBAF-WEFJV;
ШП - ShP【Key】2EX9E-9WP90-YE6YY;
Bitcoin Farm【Key】QG00Q-AH9XD-AMB7N;
Solar System【Key】BQJ6W-72PJ6-64YMZ;
Hammer 2【Key】GXHY5-HDVKK-5IG36;
Operation Desert Road【Key】DTQJG-EHNJ9-JZWRT;
Golf 2D【Key】7RHTK-7IQX7-N593K;
Space Way【Key】BMJ9R-RXI5C-LA3F4;
Gravity Ball【Key】H06V8-6TAE9-2CYAP;
Brick Breaker Ultimate【Key】BGX5J-0ZI4F-JEB8T;
Christmas Race【Key】K0DXG-CVCNJ-2Q3J9
`;
var arr = aa.split(';');
var arr2 = [];
for (var i = 0; i < arr.length; i++) {
    arr2.push(arr[i].split('【Key】')[1]);
}
console.log(arr2.join(','));

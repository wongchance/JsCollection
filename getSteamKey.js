var s = `
7GZCY-EMBDX-BQABJ	-	Trade IN	
2	DIG Weekly Bundle 222	幻世情缘	STEAM	ARGQ2-16CI4-05LIR	-	Trade IN	
3	DIG Weekly Bundle 222	Press F to pay respects	STEAM	7XC5F-2PYQJ-4768H	-	Trade IN	
4	DIG Weekly Bundle 222	mmmmm donuts arhhh......	STEAM	337NN-370WP-25MTC	-	Trade IN	
5	DIG Weekly Bundle 222	WAR CUBE	STEAM	8TNDA-4MXFF-M7ANE	YES	Trade IN	
6	DIG Weekly Bundle 222	Connor's Desert Adventure	STEAM	W4FRH-560YJ-ILVAP	-	Trade IN	
7	DIG Weekly Bundle 222	Reflex (appid-745740)	STEAM	0Y49Q-6BY5L-3PYY6	-	Trade IN	
8	DIG Weekly Bundle 222	RGB RUN	STEAM	7P4JI-P7PVK-KJZF7	-	Trade IN	
9	DIG Weekly Bundle 222	World Of Walking Cities	STEAM	0W2NX-08RR9-JPALD	-	Trade IN
`
var reg = /[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}/g; //最后一个g表示要全局匹配
console.log(s.match(reg).toString());//结果ab,ab,ab，ab
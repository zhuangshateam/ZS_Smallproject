// 一ONE小程序：：每日推送脚本
// https://mssnn.cn
// 请替换推送API地址和密钥

const request = require('superagent');

new Promise(RES => {
  request
    .get("https://wxddd057056961255f.mssnn.cn/?act=latest")
    .then(ret => {
      RES(ret.body);
    })
}).then(data => {
  let myDate = new Date();//获取系统当前时间
  //console.log(myDate.toLocaleDateString())
  request
    .post("https://wxddd057056961255f.mssnn.cn/v2/api/vpush?id=2") // 这里替换成你的推送API地址
    .set({
      "Content-Type": "application/json"
    })
    .send({
      "secret": "2d8ad-ebae4-1ec94-57052", // 在这里替换成你的API密钥
      "path": "pages/index/index",
      "data": [
        "亲，今日还没写点评呢？ 快来点评一下吧",
        myDate.toLocaleDateString()

      ]
    })
    .end(() => {
      console.log('[pushed]', data.title);
    })
})
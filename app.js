//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  globalData: {
    userInfo: null,
    imgUrl: 'http://localhost:36227/',
    api: 'http://localhost:36227/api/weixin/index.aspx',
  },
  ajaxRequest: function (options) {
    wx.request({
      url: options.url,
      data: options.data,
      success: function (res) {
        options.success(res);
      }
    })
  },
})
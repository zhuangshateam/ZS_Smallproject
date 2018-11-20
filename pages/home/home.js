var app = getApp();

Page({
  data: {
    userInfo: {},
    mode: ['在线客服', '浏览历史', '邀请好友', '意见反馈']
  },
  onLoad: function () {
    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            })
          }
        })
      }
    });
  },
  tapName: function (event) {
    console.log("发帖")
  }
})
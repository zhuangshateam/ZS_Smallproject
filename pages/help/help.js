// pages/help/help.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpList: [],//详情内容
    imgUrl: 'https://www.izhuangsha.com/',
    openid: '',
    isBtnShow:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/help_0', '进入帮助手册');//获取用户轨迹
    this.setData({
      openid: wx.getStorageSync('openId')
    })
    // 获取详情信息
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getBootPage'
      },
      success: function (res) {
        //console.log(res.data.ds)
        var hList = that.data.helpList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            var article = res.data.ds[i].instr_Details;
            WxParse.wxParse('article', 'html', article, that, 5);
            hList.push(res.data.ds[i]);
            that.setData({
              isBtnShow: res.data.ds[i].isBtnShow
            })
          }
          //console.log(dateilsList.length)
          that.setData({
            helpList: hList

          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "请检查网络!",
          icon: 'none'
        })
      },//请求失败
    })

    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
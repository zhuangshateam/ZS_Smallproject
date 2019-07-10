var util = require("../../utils/util.js")
var app = getApp()
import WxParse from '../../wxParse/wxParse.js';
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    url:'',
    opid:''
  },
  onLoad: function (options) {
    var that = this;
    // console.log("opidii:" + options.opid)
    // console.log("path:" + options.url)
    if (options.url !=undefined){
      that.setData({
        url: options.url
      })
    }
    if (options.opid != undefined) {
      console.log("options.opid:" + options.opid)
      that.setData({
        opid: options.opid
      })
    }

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    //调登录api    
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //插入登录的用户的相关信息到数据库
      //获取用户信息
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (userRes) {
              //发起网络请求
              wx.request({
                url: app.globalData.api,
                data: {
                  opt: 'getWxUserInfo',
                  code: res.code,
                  encryptedData: userRes.encryptedData,
                  iv: userRes.iv
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (result) {
                  var data = result.data.result;
                  wx.setStorageSync("userInfo", data);
                  wx.setStorageSync('openId', result.data.openId);
                  app.globalData.openid = result.data.openId;
                  app.globalData.userInfo = result.data;
                  app.globalData.nickName = result.data.nickName;
                  app.globalData.avatarUrl = result.data.avatarUrl
                  
                  // console.log(data)
                  //userInfo = data;
                }
              })
            }
          })
        }
      })
      //授权成功后，跳转进入小程序首页
      // 回跳
      var url=that.data.url;
      if (url == 'index') {
        if (that.data.opid !='null'){
          wx.reLaunch({
            url: '/pages/index/index?opid=' + that.data.opid,
          })
        }else{
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
       
      }
       else if (url == 'pages/home/home') {
        wx.switchTab({
          url: '/pages/home/home',
        })
      } else {
        wx.navigateBack();
      }

      // wx.switchTab({
      //   url: '/pages/index/index'
      // })
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getWxUsers',
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        app.globalData.userInfo = res.data;
      }
    })
  },
})

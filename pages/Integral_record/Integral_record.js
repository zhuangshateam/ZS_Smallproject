var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    ilist: [],
    openid: '',
    integral: 0, //积分
    isshare: 0, //分享页面显示返回首页按钮
    productList: [],
    imageurl: 'https://www.izhuangsha.com',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      openid: wx.getStorageSync("openId")
    })
    
    if (options.isshare == 1) {
      // console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    this.tempData();
    this.getProduct();
    //获取积分
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getUserInfo',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data.status == 0) {

          for (var i = 0; i < res.data.ds.length; i++) {
            //console.log(res.data.ds[i]["userMoney"]);
            //util.toFix(res.data.ds[i]["Retail_Price"], 2)

            that.setData({
              integral: res.data.ds[i]["UserCredits"],
              userMoney: util.toFix(res.data.ds[i]["userMoney"], 2)
            })
          }

        }
      },
      fail: function (err) {
        that.setData({
          integral: 0
        })
        wx.showToast({
          title: '网络不通畅',
          icon: 'loading',
          duration: 3000
        });
      },//请求失败
    })
  },
  /**
* 回到首页(分享的时候)
*/
  backHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 获取最新商品的方法  getIntegralProductExchange_Two
  getProduct: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getIntegralProductExchange_Two',
      },
      success: function (res) {
        var list = that.data.productList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i])
          }
          that.setData({
            productList: list
          })
        }
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  headport: function (e) {
    wx.navigateTo({
      url: '/pages/UserPsHome/UserPsHome?openid=' + e.currentTarget.dataset.jopenid,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })


  },

  //获取数据
  tempData: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getIntegralRecord',
        openid: that.data.openid
      },
      success: function (res) {
        var lists = that.data.ilist;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            lists.push(res.data.ds[i]);
            var dd = util.formatDate2(lists[i]["createTime"]);
            //console.log(dd)
            // var datetimes = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            lists[i]["createTime"] = dd;
          }
          that.setData({
            ilist: lists
          });
        } else {
          wx.showToast({
            title: "暂无纪录",
            icon: 'none'
          })
        }

      }
    })

  },
  toWelfare: function () {
    wx.switchTab({
      url: '../welfare/welfare',
    })
  }
})
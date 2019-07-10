var util = require("../../utils/util.js")
 var app = getApp();

Page({
  data: {
    tabbar: {},
    //opid:'',
    userInfo: {},
    // mode: ['在线客服', '邀请好友', '意见反馈'],
    isPostingCont:0,  //发帖数量
    isRepliesCont: 0,  //回帖数量
    isFavoritesCount: 0,  //收藏数量
    titleName:'',   //转发
    imgesUrl:'',
    integral:0, //积分
    userMoney:0,//余额
    nickName:'',
    openid:'',
   // open_id:'',
    hidden: true,
    showView: true,  //view是否显示--隐藏显示  我的审核 栏目
    showProduct: true,//view是否显示--我的产品
    showTrial: true,//view是否显示--我的试用
    //showHome:false
    SHOW_HELPER: false,
  },
  onLoad: function () {
    //console.log(app.globalData.openid)
    var that = this;
    app.editTabbar();
    app.onShow();
    //获取用户轨迹
    getApp().getUserTrajectory(1, 'onLoad', 'pages/home_0', '进入个人中心页面');//获取用户轨迹
    this.setData({
      userInfo: app.globalData.userInfo,
      openid: app.globalData.openid,
      openid: wx.getStorageSync('openId')
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    if (that.data.nickName == 'undefined' || that.data.nickName==''){
      this.setData({
        hidden: false
      });
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              //console.log(res.userInfo.nickName)
              that.setData({
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName
              })
              that.onShow();
              that.setData({
                hidden: true
              });
            }
          })
        }
      });
      
    }else{
      //console.log("不为空")
      this.setData({
        hidden: true
      });
      this.loadMore();
    }
    this.loadMore();
  },
  // goLogin: function (e) {
  //   this.setData({
  //     showHome: true
  //   })
  //   wx.redirectTo({
  //     url: '../login/login',
  //   })
  // },
  // jumpToLogsPage: function (data) {
  //   this.setData({
  //     showHome:false
  //   })
  // },
  loadMore:function(){
    var that = this;
    wx.request({    //栏目是否显示
      url: app.globalData.api,
      data: {
        opt: 'getShowToexamine',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data == 'True') {
          that.setData({
            showView: false,
          })
        }

      }
    })
    wx.request({    //我的产品是否显示
      url: app.globalData.api,
      data: {
        opt: 'getShowMyproduct',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data == 'True') {
          that.setData({
            showProduct: false,
          })
        }

      }
    })
    wx.request({    //我的试用是否显示
      url: app.globalData.api,
      data: {
        opt: 'getShowMyTrial',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data == 'True') {
          that.setData({
            showTrial: false
          })
        }

      }
    })

    wx.request({  //获取发贴
      url: app.globalData.api,
      data: {
        opt: 'getPersonalCenter',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          isPostingCont: res.data
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '网络不通畅',
          icon: 'loading',
          duration: 1500
        });
      }
    })
    wx.request({  //获取回贴
      url: app.globalData.api,
      data: {
        opt: 'getRepliesCount',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          isRepliesCont: res.data
        })
      },
      fail: function (err) {
        that.setData({
          hidden: false,
          showerror: "block",
        });
      }
    })
    wx.request({  //获取收藏
      url: app.globalData.api,
      data: {
        opt: 'getFavoritesCount',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          isFavoritesCount: res.data
        })
      }
    })
    wx.request({  //转发
      url: app.globalData.api,
      data: {
        opt: 'getForwardImg'
      },
      success: function (res) {
        //console.log(res.data.ds[0].titleNmae)
        that.setData({
          titleName: res.data.ds[0].titleNmae,
          imgesUrl: res.data.ds[0].imgUrl
        })
      }
    })
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
              integral:res.data.ds[i]["UserCredits"],
              userMoney: util.toFix(res.data.ds[i]["userMoney"],2)
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
  // personHome:function(){
  //   wx.navigateTo({
  //     url: '/pages/PersonHome/PersonHome?integral='+this.data.integral,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
  //   })
  // },
  onPullDownRefresh: function () {
     this.loadMore();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onReady: function () {

  },
  onShow:function(){
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          const prevUrl = util.getCurrentPageUrl();
          //console.log(prevUrl)
          wx.redirectTo({
            url: '../login/login?url='+prevUrl,
          })
        }
      }
    })
    this.loadMore();
    this.setData({
      hasLogin: wx.getStorageSync('isLogin')
    })
  },
  toBAcard: function () {
    wx.navigateTo({
      url: '../cardBA/cardBA',
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // return {
      //   title: '自定义分享标题',
      //   desc: '自定义分享描述',
      //   path: '/pages/index/index'
      // }
      //console.log(app.imgUrl)
      return {
        title: this.data.titleName,
        imageUrl: app.globalData.imgUrl + this.data.imgesUrl,//图片地址
        path: '/pages/index/index',// 用户点击首先进入的当前页面
        success: function (res) {
          // 转发成功
          console.log("转发成功:");
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:");
        }
      }
    }
    return {
      title: this.data.titleName,
      imageUrl: app.globalData.imgUrl + this.data.imgesUrl,//图片地址
      path: '/pages/index/index',// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }


  },
})
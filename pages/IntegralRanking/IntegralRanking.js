const app = getApp()
Page({
  data: {
    integrallist:[],
    myRanking:[],
    openid:''
  },
  onLoad: function (options) {
    var that =this;
    // 页面初始化 options为页面跳转所带来的参数
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/IntegralRanking_0', '进入积分排行页面');//获取用户轨迹
    that.tempData();
    //获取头像
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        openid: wx.getStorageSync('openId')
      })
    });
    that.myFriendRank();
  },
  //查自己的排名
  myFriendRank: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getintegralRanking_UserInfo',
        openid: that.data.openid
      },
      success: function (res) {
        // console.log(res.data.ds);
        var list = that.data.myRanking;

        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            console.log(res.data.ds[i])
          }
          that.setData({
            myRanking: list
          });
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
  headport: function (e){
    wx.navigateTo({
      url: '/pages/UserPsHome/UserPsHome?openid=' + e.currentTarget.dataset.jopenid + '&headurl=' + e.currentTarget.dataset.headurl + '&nickname=' + e.currentTarget.dataset.nickname + '&city=' + e.currentTarget.dataset.city,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })       
  },
  //测试临时数据
  tempData: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getintegralRanking'
      },
      success: function (res) {
        var lists = that.data.integrallist
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            lists.push(res.data.ds[i]);      
          }
          that.setData({
            integrallist: lists
          });
        }else{
          wx.showToast({
            title: "服务端错误！",
            icon: 'none'
          })
        }
      }
    })
  }
})
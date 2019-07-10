var app = getApp()
Page({
  data: {
    openid: '',
    nickname:'',
    headurl:'',
    // orderItems
    orderItems: [],
    avatarUrl:'',
    nickName:'',
    sex: '',
    ipt_city: '',//城市
    rexperienceCount:0,
    compositionCount:0,
    integral: 0, //积分
    praiseTotal:0,  //点赞总数
    rankingTop:0, //排行名次
  },
  //事件处理函数-点击进入已发布数据
  toOrderRep: function () {   //日记
    wx.navigateTo({
      url: '../OthersPosting/OthersPosting?openid=' + this.data.openid + '&pocounts=' + this.data.rexperienceCount
    })
  },
  toOrderCom: function () {  //作文
    wx.navigateTo({
      url: '../OthersZWPosting/OthersZWPosting?openid=' + this.data.openid + '&pocounts=' + this.data.compositionCount
    })
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      openid: options.openid,
      nickname: options.nickname,
      headurl: options.headurl,
      headurl: options.headurl,
      ipt_city:options.city
    })
    that.moreLoad();
  },
  moreLoad: function () {
    var that = this
  
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getPersonclickUser',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data.ds)
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              avatarUrl: res.data.ds[i]["headimgurl"],
              nickName: res.data.ds[i]["nickname"],
              sex: res.data.ds[i]["sex"],
              ipt_city: res.data.ds[i]["city"]
            });
          }

        }
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })

    //获取日记数量
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getwx_userRexperienceCount',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
          //console.log(res.data)
          that.setData({
            rexperienceCount: res.data
          })

      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取作文数量
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getuserCompositionCount',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
          that.setData({
            compositionCount: res.data
          })
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取积分
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getintegralUsers',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          integral: res.data
        })
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取点赞总数
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getPraiseCount',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          praiseTotal: res.data
        })
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取排行名次
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getUsersRankingTop',
        openid: this.data.openid,
      },
      success: function (res) {
        console.log(res)
        if(res.data==''){
          that.setData({
            rankingTop: 0
          })
        }else{
          that.setData({
            rankingTop: res.data
          })
        }
        
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
  },
  onShow: function () {
    this.moreLoad();
  },
})
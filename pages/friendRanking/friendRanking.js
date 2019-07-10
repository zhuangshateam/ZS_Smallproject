// pages/friendRanking/friendRanking.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    friendList:[],
    openid: '',
    myRanking:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取头像
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        openid: wx.getStorageSync('openId')
      })
    });
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    // 页面初始化 options为页面跳转所带来的参数
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/friendRanking_0', '进入邀请排行页面');//获取用户轨迹
    that.tempData();
    that.myFriendRank();
  },

  //查自己的排名
  myFriendRank:function(){
    var that = this;
    
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getUsersInvitationNumber',
        openid:that.data.openid
      },
      success: function (res) {
        var list = that.data.myRanking
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
          }
          that.setData({
            myRanking: list
          });
        }
       }
    })
  },

  //haoypi
  tempData: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getInvitationNumber'
      },
      success: function (res) {
        var lists = that.data.friendList
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            var uname = res.data.ds[i]["nickname"];
            var news_nickname = that.formatName(uname);
            res.data.ds[i]["nickname"] = news_nickname
            lists.push(res.data.ds[i]);
            
          }
          that.setData({
            friendList: lists
          });
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
  },
  formatName:function(name) {
    let newStr;
    if(name.length === 2) {
      newStr = name.substr(0, 1) + '*';
    } else if (name.length > 2) {
      let char = '';
      for (let i = 0, len = name.length - 2; i < len; i++) {
        char += '*';
      }
      newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }

      return newStr;
    },
  // hidden: function (str, frontLen, endLen) {
  //   var len = str.length - frontLen - endLen;
  //   var xing = '';
  //   for (var i = 0; i < len; i++) {
  //     xing += '*';
  //   }
  //   return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  // },
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
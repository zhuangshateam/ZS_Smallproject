// pages/cardBA/cardBA.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: {},
    cardList:[],  //已邀请的好友
    codeImg: '',
    openid: '',
    friendNum: 0,   //推荐进入好友的数量
    imgUrl: 'https://www.izhuangsha.com/',
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
    //获取用户轨迹
    getApp().getUserTrajectory(3, 'onLoad', 'pages/cardBA_0', '进入个人中心邀请好友分享页面');//获取用户轨迹
    wx.hideShareMenu();
    that.setData({
      openid: wx.getStorageSync('openId')
    })
    //获取头像
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    that.getQrcode();
    that.getData();
  },
  getData:function(){
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getToViewList',
        openid:that.data.openid
      },
      success: function (res) {
        var vlist = that.data.cardList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            vlist.push(res.data.ds[i]);
            //console.log(res.data.ds[i])

          }
          that.setData({
            cardList: vlist,
            friendNum: res.data.ds.length
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })
      },//请求失败
    })
  },
  //获取二维码
  getQrcode: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    console.log(that.data.openid)
    wx.request({        //根据openid查询wxuserinfo用户ID
      url: app.globalData.api,
      data: {
        opt: 'getWxId',
        openid: that.data.openid
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data != '') {
          var _jsonData = {
            page: 'pages/index/index',
            width: 280,
            scene: res.data
          }
          wx.request({
            // 调用接口C
            url: app.globalData.api,
            data: {
              opt: 'getfriend_Qrcode',
              jsonData: _jsonData,
              openid: that.data.openid
            },
            success(ress) {
              that.setData({
                codeImg: ress.data
              })
              // console.log(that.data.codeImg)
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      }
    })

  },
  formSubmit: function (e) {
    var that=this;
    //console.log(e.detail.formId)
    wx.request({        //根据openid查询wxuserinfo用户ID
      url: app.globalData.api,
      data: {
        opt: 'getmodifyUsersFromId',
        openid: that.data.openid,
        fromId: e.detail.formId
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  toFriendRanking: function () {
    wx.navigateTo({
      url: '../friendRanking/friendRanking',
    })

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
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          const prevUrl = util.getCurrentPageUrl();
          //console.log(prevUrl)
          wx.redirectTo({
            url: '../login/login?url=' + prevUrl,
          })
        }
      }
    })
    this.setData({
      hasLogin: wx.getStorageSync('isLogin')
    })
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
  onShareAppMessage: function (res) {
    var that=this;
    //获取用户轨迹
    getApp().getUserTrajectory(3, 'onLoad', 'pages/cardBA_1', '点击了邀请好友按钮--BA名片');//获取用户轨迹
    var openid = res.target.dataset.openid;
    var nickname = that.data.userInfo.nickName;
    if (res.from === 'button') {
      return {
        title: nickname+' 邀请你一起来BA学习',
        path: '/pages/index/index?opid=' + openid,
        imageUrl: "https://www.izhuangsha.com/api/images/BA_crd/friend_add.jpg",//图片地址
        success: function (res) {
          console.log('成功', res)
        }
      }
    }
  },

  //生成海报
  cardPoster: function () {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(3, 'onLoad', 'pages/cardBA_2', '点击了生成图片按钮--BA名片');//获取用户轨迹
    wx.showLoading({
      title: '请稍等',
      duration: 3000,
      mask: true
    })

    wx.request({
      url: app.globalData.api,
      data: {
        // opt: 'getSelectJingyanQrcode',
        opt: 'getSelectNewUser_Qrcode',
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == "0") {
          console.log("6666" + res.data)
          that.getQrcode();
        } else {
          console.log("yicunz" + res.data)
          wx.navigateTo({
            url: '/pages/cardPoster/cardPoster?codeImg=' + res.data


          });
        }
      }
    })

    // wx.showToast({
    //   title: "开发中",
    //   icon: 'none',
    //   duration: 2000
    // });
    // wx.navigateTo({
    //   url: '/pages/experiencePoster/experiencePoster?id=' + that.data.id,
    // });
  },
})
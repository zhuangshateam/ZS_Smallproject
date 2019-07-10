var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    telIpuNum:'',//输入金额
    buttonClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      balance: options.userMoney,
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/withdraw_0', '进入提现页面');//获取用户轨迹
    // if (app.globalData.iphone == true) { that.setData({ iphone: 'iphone' }) }
    // wx.request({
    //   url: app.globalData.urls + '/user/amount',
    //   data: {
    //     token: app.globalData.token
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       that.setData({
    //         balance: res.data.data.balance,
    //         freeze: res.data.data.freeze,
    //         score: res.data.data.score
    //       });
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  Reclick: function () {
    var dangqiantime = (Date.parse(new Date()) / 1000);
    var daojishitime = wx.getStorageSync('m')
    var times = dangqiantime - daojishitime
    if (times > 0) {
      console.log('超过15秒')
      wx.setStorageSync('m', dangqiantime + 15)//把15秒数放到缓存
      return true
    } else {
      //当发生了15秒以内多次点击等事件，弹窗提示
      return false
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
    // wx.request({
    //   url: app.globalData.urls + '/user/amount',
    //   data: {
    //     token: app.globalData.token
    //   },
    //   success: function (res) {
    //     if (res.data.code == 0) {
    //       that.setData({
    //         balance: res.data.data.balance,
    //         freeze: res.data.data.freeze,
    //         score: res.data.data.score
    //       });
    //     }
    //   }
    // })
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

  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindDetailed: function () {
    wx.navigateTo({
      url: '/pages/Detailed/Detailed',
    })
  },
  getAmount: function (e) {
    var val = e.detail.value;
 

    var balance = this.data.balance;
    if (parseInt(val) > parseInt(balance)){
      wx.showToast({
        title: '无法输入大于账户余额',
        icon: 'none',
        duration: 2000,
        mask: true
      })
      this.setData({
        telIpuNum: ""
      });
    }
  },
  bindSave: function (e) {
    var that = this;
    
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/withdraw_1', '点击了确认提现');//获取用户轨迹
    var amount = e.detail.value.amount;
    var balance = parseInt(that.data.balance);
    if (parseInt(amount) <= parseInt(balance)){
      if (amount == "" || parseInt(amount) * 1 < 100) {
        wx.showModal({
          title: '提示',
          content: '金额不足100无法提现',
          showCancel: false
        })
        return
      }else{
        that.setData({
          buttonClicked:true
        })
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
        //防止重复点击支付
        if (!this.Reclick()) {
          wx.showModal({
            title: '提示',
            content: '请勿重复点击确认支付',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          return false
        }
        wx.request({
          url: 'https://www.izhuangsha.com/api/payment/qiyePay.aspx',
          data: {
            opt: 'EnterprisePay',
            openid: app.globalData.openid,
            nickName: app.globalData.nickName,
            charge_Amt: amount,
            className: '提现'
            // title:'测试开发'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data == "SUCCESS") {
              wx.showModal({
                title: '提示',
                content: '提现成功,已存入微信零钱',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.bindCancel();
                  }
                }
              })
              wx.hideLoading();
              setTimeout(function () {
                that.setData({
                  buttonClicked: false
                })
              }, 1000)
            } else {
              //console.log(res.data)
              wx.showModal({
                title: '提示',
                content: '提现失败',
                showCancel: false
              })
              wx.hideLoading();
              setTimeout(function () {
                that.setData({
                  buttonClicked: false
                })
              }, 1000)
            }
          }
        })
      }
    }else{
      wx.showToast({
        title: '请输入正确金额',
        image: '/images/Tips.png',
        duration: 2000,
        mask: true
      })
    }
    
  }
})
// pages/OntrialTask2/OntrialTask2.js
var list = []
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['省', '市', '区'],
    min: 5,
    loading: false,
    copNumber: 0,//份数
    tid: '',//详情ID
    // applicantsNum: 0,  //申请试用人数
    product_Name: '',  //产品 名称
    taskCommisNum: 0,  //佣金

    // city: '省',
    // province: '/市',
    // area:'区',
    openid: '',
    formId: '',//存入数据中第二个fromId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      tid: options.id,
      copNumber: options.copNum,
      product_Name: options.product_Name,
      taskCommisNum: options.taskCommisNum,
      formId: options.formId,
      openid: wx.getStorageSync('openId')
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/OntrialTask_0', '点击了申请佣金任务页面');//获取用户轨迹
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
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

  },
  RegionChange: function (e) {
    var that = this
    that.setData({
      region: e.detail.value,
      city: e.detail.value[0],
      province: e.detail.value[1],
      area: e.detail.value[2]

    });
    console.log(that.data.region);
  },
  //表单提交
  formSubmit: function (e) {
    var that = this
    wx.showLoading({
      title: '提交中',
      mask: true
    })
    if (e.detail.value.userName.length == 0) {
      wx.showToast({
        title: `请填写姓名 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.corporateName.length == 0) {
      wx.showToast({
        title: `请填写公司名称 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.positionName.length == 0) {
      wx.showToast({
        title: `请填写职位 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.phoneNum.length == 0) {
      wx.showToast({
        title: `请填写电话 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (that.data.city == '省') {
      wx.showToast({
        title: `请选择城市 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.address_Details.length == 0) {
      wx.showToast({
        title: `请填写详细地址 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    } else if (e.detail.value.address_Details.length < 5) {
      wx.showToast({
        title: `详细地址必须在5个字以上`,
        icon: 'none',
        duration: 2000
      })
      return false
    }
    that.setData({
      loading: true,
      submitHidden: false
    })
    console.log(that.data.region[2])
    //提交
    wx.request({
      url: app.globalData.api,
      // header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      header: {
        'content-type': 'application/json'
      },
      data: {
        opt: 'setApplyOnTrialTask',
        tid: that.data.tid,
        openid: app.globalData.openid,
        nickName: app.globalData.nickName,
        avatarUrl: app.globalData.avatarUrl,
        userName: e.detail.value.userName,
        corporateName: e.detail.value.corporateName,
        positionName: e.detail.value.positionName,
        phoneNum: e.detail.value.phoneNum,
        city: that.data.region[0],
        province: that.data.region[1],
        county: that.data.region[2],
        address_Details: e.detail.value.address_Details,
        form_id: e.detail.formId,
        from_id1: that.data.formId
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 1) {
          that.setData({
            loading: false,
            submitHidden: true
          })
          wx.showLoading({
            title: '申请成功.',
            mask: true
          })

          wx.showLoading({
            title: '正在跳转...',
            mask: true
          })
          setTimeout(function () {
            wx.hideLoading();
            //关闭当前页面，跳转到应用内的某个页面
            wx.redirectTo({
              url: '/pages/Mytask/Mytask',
            });
            //wx.navigateBack({ changed: true });//返回上一页
          }, 2000) //延迟时间 这里是1秒
        } else {
          wx.showToast({
            title: "提交失败，请检查网络！",
            icon: 'none',
            duration: 3000,
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
  }
})
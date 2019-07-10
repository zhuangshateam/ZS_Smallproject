// pages/Ontrial2/Ontrial2.js
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
    copNumber: 0, //试用份数
    details_id: '', //详情ID
    applicantsNum: 0, //申请试用人数
    city: '省',
    province: '市',
    area: "区",
    openid: '',
    userinfo: {},
    disabled: false,
    isshow: true,
    isChecked: 0,
    isDisabled: true,
    isHide:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      that.setData({
        userInfo: res.userInfo
      })

    }
    this.setData({
      details_id: options.id,
      copNumber: options.copNum,
      openid: app.globalData.openid,
      userInfo: wx.getStorageSync('userInfo')
    })
    app.getOpenid().then(function(res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getSelectUserNum',
        details_id: that.data.details_id
      },
      success: function(res) {
        that.setData({
          applicantsNum: res.data
        })
      }
    })
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  RegionChange: function(e) {
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
  formSubmit: function(e) {
    var that = this
    wx.showLoading({
      title: '提交中...',
      mask:true
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
    // if (e.detail.value.address_txt.length == 0) {
    //   wx.showToast({
    //     title: `请填写理由 `,
    //     image: '/images/Tips.png',
    //     duration: 2000
    //   })
    //   return false
    // } else if (e.detail.value.address_txt.length < 5) {
    //   wx.showToast({
    //     title: `申请理由必须在5个字以上`,
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false
    // }
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
      //submitHidden: false
    })
    //提交
    wx.request({
      url: app.globalData.api,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        opt: 'setApplyOnTrial',
        details_id: that.data.details_id,
        openid: that.data.openid,
        nickName: that.data.userInfo.nickName,
        avatarUrl: that.data.userInfo.avatarUrl,
        userName: e.detail.value.userName,
        corporateName: e.detail.value.corporateName,
        positionName: e.detail.value.positionName,
        phoneNum: e.detail.value.phoneNum,
        address_txt: e.detail.value.address_txt,
        city: that.data.region[0],
        province: that.data.region[1],
        area: that.data.region[2],
        address_Details: e.detail.value.address_Details,
        copNumber: that.data.copNumber,
        form_id: e.detail.formId
      },
      success: function(res) {
        //console.log(res.data)
        if (res.data == 1) {
          that.setData({
            loading: false,
            disabled: true
            //submitHidden: true
          })
          wx.showToast({
            title: "提交成功",
            duration: 2000,
          })
          setTimeout(function() {
            wx.navigateBack({
              changed: true
            }); //返回上一页
          }, 2000) //延迟时间 这里是1秒

        } else {
          wx.showToast({
            title: "提交失败，请检查网络！",
            icon: 'none',
            duration: 3000,
          })
        }
      }
    })
  },
  // 免责声明
  tipAgree: function() {//免责声明确认按钮关闭声明书
    this.setData({
      isshow: false,
      isHide:false
    })
  },
  rightok: function(e) {//同意按钮,控制确认按钮是否可以启用
    var that = this;
    if (e.detail.value == '') {
      that.setData({
        isChecked: 0,
        isDisabled: true
      })
    } else {
      that.setData({
        isChecked: 1,
        isDisabled: false
      })
    }
  }















  
})
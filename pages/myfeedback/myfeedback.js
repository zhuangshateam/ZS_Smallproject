//const url = require('../../utils/requireurl.js').url;
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({
  data: {
    loading: false,
    contact: '',
    contant: '',
    userInfo: '',
  },
  onLoad: function () {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/myfeedback_0', '进入提交反馈页面');//获取用户轨迹
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },

  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    let contact = e.detail.value.contant;
    let regPhone = /^1[3578]\d{9}$/;
    let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容不能为空!',
      })
      return false
    }
    this.setData({
      loading: true
    })
    let model, system, version;
    wx.getSystemInfo({
      success: function (res) {
        model = res.model;
        system = res.system;
        version = res.version;
      }
    })
    console.log(model);
    //var base_model = base.baseEncode(model);
    wx.request({
      url: app.globalData.api,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        opt: 'getmyfeedback',
        openid: app.globalData.openid,
        nickname: app.globalData.userInfo.nickName,
        content: content,
        contact: contact,
        device_model: model //手机型号
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        let status = res.data;
        if (status == 1) {
          _that.setData({
            loading: false,
            contact: '',
            contant: ''
          })
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
            duration: 3000
          })
        }
      },
      fail: function () {
        console.log("意见反馈接口调用失败")
      }
    })
    // if (contact == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '手机号或者邮箱不能为空!',
    //   })
    //   return false
    // }
    // if (contact == "" && content == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '反馈内容,手机号或者邮箱不能为空!',
    //   })
    //   return false
    // }
    // if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对 这个关系饶了俩小时^_^
    //   wx.showModal({
    //     title: '提示',
    //     content: '您输入的手机号或者邮箱有误!',
    //   })
    //   return false
    // } else {
    //   this.setData({
    //     loading: true
    //   })
    //   let model, system, version;
    //   wx.getSystemInfo({
    //     success: function (res) {
    //       model = res.model;
    //       system = res.system;
    //       version = res.version;
    //     }
    //   })
    //   console.log(model, system, version);
    //   wx.request({
    //     url:app.globalData.api,
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     data: {
    //       opt: 'getmyfeedback',
    //       openid:app.globalData.openid,
    //       content: content,
    //       contact: contact,
    //       device_model: model, //手机型号
    //       device_system : system, //操作系统版本
    //       app_version: version  // 微信版本号
    //     },
    //     method: 'POST',
    //     success: function (res) {
    //       console.log(res.data)
    //       let status = res.data;
    //       if (status == 1) {
    //         _that.setData({
    //           loading: false,
    //           contact: '',
    //           contant: ''
    //         })
    //         wx.showToast({
    //           title: '提交成功！',
    //           icon: 'success',
    //           duration: 3000
    //         })
    //       }
    //     },
    //     fail: function () {
    //       console.log("意见反馈接口调用失败")
    //     }
    //   })
    // }
  }
})
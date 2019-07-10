// pages/ExperiencePoster/ExperiencePoster.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    painting: {},
    shareImage: '',
    userInfo: {},
    openid: '',
    imageurl: 'https://www.izhuangsha.com',
    codeImg: '',  //小程序码路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '生成中...'
    })
    //获取头像
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        console.log(wx.getStorageSync('openid'))
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    that.setData({
      codeImg: options.codeImg
    })
    this.eventDraw()
  },
  onShow: function () {
    var that = this;
    that.eventDraw();
  },
  eventDraw() {
    var that = this;

    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    that.setData({
      painting: {
        width: 375,
        height: 654,
        clear: true,
        views: [
          {
            type: 'image',
            url: 'https://www.izhuangsha.com/api/images/BA_crd/card_bj2.jpg',
            top: 0,
            left: 0,
            width: 375,
            height: 653
          },
          {
            type: 'image1',
            url1: that.data.userInfo.avatarUrl,
            top: 24,
            left: 156
            // width: 80,
            // height: 80
          },
          {
            type: 'text',
            content: that.data.userInfo.nickName,
            fontSize: 16,
            color: '#EB70AB',
            textAlign: 'center',
            top: 106,
            left: 188,
            bolder: true
          },
          {
            type: 'image',
            url: that.data.imageurl + that.data.codeImg,
            top: 380,
            left: 100,
            width: 180,
            height: 180
          },
          {
            type: 'text',
            content: '长按识别二维码查看详情',
            fontSize: 14,
            color: '#666666',
            textAlign: 'left',
            top: 700,
            left: 110
          }

        ]
      }
    })
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    //console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
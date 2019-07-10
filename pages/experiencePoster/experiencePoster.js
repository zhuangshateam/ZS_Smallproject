// pages/ExperiencePoster/ExperiencePoster.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    painting: {},
    shareImage: '',
    imgList:[],
    nid:'',
    img1: '',
    img2: '',
    img3: '',
    openid: '',
    imageurl: 'https://www.izhuangsha.com',
    codeImg: '',  //小程序码路径
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '生成中...'
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        //console.log(wx.getStorageSync('openid'))
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    that.setData({
      nid: options.id, //id
      codeImg: options.codeImg
    })
    wx.request({  //获取图片
      url: app.globalData.api, //接口地址
      data: {
        opt: 'getPicture_img',
        id: that.data.nid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log( res.data.ds)
        var imglist = that.data.imgList;
        if (res.data.status === 0) {
          if (res.data.ds.length == 3) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
              img2: res.data.ds[1].imagesUrl,
              img3: res.data.ds[2].imagesUrl,
            })
          }
          if (res.data.ds.length == 2) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
              img2: res.data.ds[1].imagesUrl
            })
          }
          if (res.data.ds.length == 1) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
            })
          }
          for (var i = 0; i < res.data.ds.length; i++) {
            imglist.push(res.data.ds[i]);
          }
          that.setData({
            imgList: imglist
          });
        }
      }
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
    wx.request({  //获取详情页面标题内容等 --日记详情
      url: app.globalData.api,
      data: {
        opt: 'getNewsInfo',
        nid: that.data.nid
      },
      success: function (res) {
        //console.log(res.data.ds)
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              painting: {
                width: 375,
                height: 750,
                clear: true,
                views: [
                  {
                    type: 'image',
                    url: 'https://www.izhuangsha.com/api/images/jingyan_bj.jpg',
                    top: 0,
                    left: 0,
                    width: 375,
                    height: 750
                  },
                  {
                    type: 'image1',
                    url1: res.data.ds[i]["headimgurl"],
                    top: 40,
                    left: 150
                    // width: 80,
                    // height: 80
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["nickname"],
                    fontSize: 16,
                    color: '#EB70AB',
                    textAlign: 'center',
                    top: 120,
                    left: 178,
                    bolder: true
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["ReviewTitle"],
                    fontSize: 17,
                    lineHeight: 22,
                    color: '#000',
                    textAlign: 'center',
                    top: 145,
                    left: 185,
                    width: 265,
                    MaxLineNumber: 2,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'line',
                    startX: 24,
                    startY: 205,
                    endX: 350,
                    endY: 205,
                    style: '#DBDDDD',
                    lineWidth: 2
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["Reviewcontent"],
                    fontSize: 14,
                    lineHeight: 20,
                    color: '#666666',
                    textAlign: 'left',
                    top: 220,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 11,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'image',
                    url: that.data.img1,

                    top: 450,
                    left: 38,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'image',
                    url: that.data.img2,
                    top: 450,
                    left: 144,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'image',
                    url: that.data.img3,
                    top: 450,
                    left: 250,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'line',
                    startX: 24,
                    startY: 550,
                    endX: 350,
                    endY: 550,
                    style: '#CDCDCD',
                    lineWidth: 2
                  },
                  {
                    type: 'image',
                    url: that.data.imageurl + that.data.codeImg,
                    top: 560,
                    left: 128,
                    width: 120,
                    height: 120
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
          }
        }
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
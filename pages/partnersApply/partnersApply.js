var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    userInfo: '',
    uploadimgs: [], //上传图片列表-
    submitHidden: true,
    currentWordNumber: 0,   //文本框内字数统计
  },
  /**
* 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/Partners_0', '进入品牌合作页面');//获取用户轨迹
    this.setData({
      uploadimgs: [],
      userInfo: app.globalData.userInfo,
    })
  },

  //表单提交
  formSubmit: function (e) {
    console.log(e.detail.value.title)
    if (e.detail.value.title.length == 0) {
      wx.showToast({
        title: `请填写公司名称 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.shangpin.length == 0) {
      wx.showToast({
        title: `请填写商品名称 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.guige.length == 0) {
      wx.showToast({
        title: `请填写规格 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.fenshu.length == 0) {
      wx.showToast({
        title: `请填写数量 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.xingming.length == 0) {
      wx.showToast({
        title: `请填写姓名 `,
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
    var that = this;
    const arr = [];
    this.setData({ submitHidden: false })
    for (let path of this.data.uploadimgs) {
      wx.uploadFile({
        url: app.globalData.api,
        filePath: path,
        name: 'fileNames',
        formData: {
          opt: 'setBusinessCardImgUpload',
          images: path
        },
        success: function (res) {
          //that.setData({ submitHidden: true })
          var data = res.data
          //console.log(res);
        },
        fail: function (fail) {
          console.log(fail);
          // 这里是失败的回调，取值方法同上,把res改一下就行了  
        },
      })
      var str = path;
      var obj = str.lastIndexOf("/");
      var newpath = str.substr(obj + 1);
      //console.log(newpath);
      arr.push(newpath)
    }
    //图片上传
    //将选择的图片组成一个Promise数组，准备进行并行上传

    //提交
    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        opt: 'setBrandCooperList',
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        title: e.detail.value.title,
        shangpin: e.detail.value.shangpin,
        guige: e.detail.value.guige,
        fenshu: e.detail.value.fenshu,
        xingming: e.detail.value.xingming,
        phoneNum: e.detail.value.phoneNum,
        form_id: e.detail.formId,
        arr: arr.join(",")
      },
      success: function (requestRes) {
        that.setData({ submitHidden: true })
        // wx.showToast({
        //   title: '您的合作申请已收到妆啥小二将尽快与您联系',
        //   icon: 'none',
        //   duration: 4000,
        // })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/ToExamine/ToExamine'
          })

        }, 1000)
        // wx.switchTab({
        //   url: '../home/home',
        //   success: function (e) {
        //     var page = getCurrentPages().pop();
        //     if (page == undefined || page == null) return;
        //     page.onShow();
        //   }
        // });
        that.setData({
          form_info: '',
          uploadimgs: [],
        })
      }, error: function () {
        that.setData({ submitHidden: false })
        wx.showToast({
          title: '提交失败请重试',
          icon: 'loading',
          duration: 1500
        });
      },
      fail: function () {
        that.setData({ submitHidden: false })
        wx.showToast({
          title: '网络不通畅',
          icon: 'loading',
          duration: 1500
        });
      },
      complete: function () {
      }
    })
  },
  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照', '取消'],
      itemColor: "#D8497C",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imgeList = that.data.uploadimgs.concat(res.tempFilePaths);
        that.setData({
          uploadimgs: imgeList
        });
      }
    })
  },
  handleImagePreview(e) {
    console.log(e.target.dataset.idx);
    const idx = e.target.dataset.idx
    const images = this.data.uploadimgs
    console.log(images)
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    Array.prototype.remove = function (i) {
      const l = this.length;
      if (l == 1) {
        return []
      } else if (i > 1) {
        return [].concat(this.splice(0, i), this.splice(i + 1, l - 1))
      }
    }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  },
  
  onPullDownRefresh() {

    setTimeout(() => {

      wx.stopPullDownRefresh(); //停止下拉元点

    }, 3000)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
})
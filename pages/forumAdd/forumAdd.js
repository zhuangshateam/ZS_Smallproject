// pages/empiricalAdd/empiricalAdd.js
var util = require('../../utils/util.js');
var ctx = wx.createCanvasContext("myCanvas");
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    openid: '',
    min: 5, //最少字数
    max: 5000, //最多字数 (根据自己需求改变)
    index: null,
    submitHidden: true,
    loading: false,
    uploadimgs: [], //上传图片列表-
    imageSrc: '',
    showView: true, //view是否显示
    isChecked: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/forumAdd_0', '进入匿名发布页面');//获取用户轨迹
    that.setData({
      uploadimgs: [],
      openid: wx.getStorageSync('openId'),
      userInfo: app.globalData.userInfo
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var that=this;
    that.setData({
      isChecked: e.detail.value
    })
  },

  // 图片上传
  handleTap() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imageSrc: tempFilePaths[0],
          ishidden: true
        })
        //另一个上传图片插件
        // wx.navigateTo({
        //   url: '../cropper/cropper?src='+tempFilePaths[0]
        // })
      }
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.uploadimgs;
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
    // const idx = e.target.dataset.idx
    // const images = this.data.uploadimgs;
    // var arr=[];
    // var len = this.data.uploadimgs.length;
    // for(var i=0;i<len;i++){
    //   arr.push(this.data.uploadimgs[i].url)
    // }
    // wx.previewImage({
    //   current: arr[idx],  //当前预览的图片
    //   urls: arr,  //所有要预览的图片
    // })
  },
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    var that = this;
    var images = that.data.uploadimgs;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }
        that.setData({
          uploadimgs: images
        });
      }
    })
  },
  cropperDone(e) {
    this.setData({
      ishidden: false
    })
    const {
      src,
      cropperData
    } = e.detail;
    //console.log(src)
    this.setData({
      uploadimgs: this.data.uploadimgs.concat(src)
    })
    // wx.previewImage({
    //   current: '', // 当前显示图片的http链接
    //   urls: [src] // 需要预览的图片http链接列表
    // })
  },
  cropperCancel() {
    this.setData({
      ishidden: false
    })
    console.log('cancel');
  },
  //字数限制  
  txt_inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        texts: "加油，够5个字可以得20积分哦"
      })
    else if (len > this.data.min)
      this.setData({
        texts: " "
      });

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });

  },
  //表单提交
  formSubmit: function (e) {
    //console.log(e.detail.value.title)
    if (e.detail.value.title.length == 0) {
      wx.showToast({
        title: `请填写标题 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    // if (e.detail.value.textarea.length == 0) {
    //   wx.showToast({
    //     title: `请填写内容 `,
    //     image: '/images/Tips.png',
    //     duration: 2000
    //   })
    //   return false
    // }
    var that = this;
    const arr = [];
    that.setData({
      submitHidden: false,
      loading: true
    })
    for (let path of that.data.uploadimgs) {
      wx.uploadFile({
        url: app.globalData.api,
        filePath: path,
        name: 'fileName',
        formData: {
          opt: 'postWxMessageImages',
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
      console.log(str);
      var obj = str.lastIndexOf("/");
      var newpath = str.substr(obj + 1);
      //console.log(newpath);
      arr.push(newpath)
    }
    //提交
    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        opt: 'getAnonymousAdd',
        isChecked: that.data.isChecked,
        title: e.detail.value.title,
        textarea: e.detail.value.textarea,
        openid: that.data.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        form_id: e.detail.formId,
        arr: arr.join(",")
      },
      success: function (resl) {
        //console.log(resl.data.status);
        that.setData({
          submitHidden: true,
          loading: false
        })
        wx.showToast({
          title: "发表成功,积分+10",
          icon: 'none',
          duration: 3000,
        })
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        });
        that.setData({
          form_info: '',
          uploadimgs: []
        });
        // wx.request({
        //   url: app.globalData.api,
        //   data: {
        //     opt: "setcommIntegral",
        //     openid: app.globalData.openid,
        //     integralCont: 30
        //   },
        //   success: function (res) {
        //     //console.log(res);
        //     if (res.data.status === 1) {
        //       //console.log("积分+20")
        //       wx.showToast({
        //         title: "积分+30",
        //         duration: 3000,
        //       })
        //     }
        //   }
        // })
      },
      fail: function () {
        that.setData({
          submitHidden: false,
          loading: false
        })
        wx.showToast({
          title: '网络不通畅',
          icon: 'loading',
          duration: 1500
        });
      }
    })
  },
  onShow: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          //console.log("wei")
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })

  },
  // onPullDownRefresh() {

  //   setTimeout(() => {

  //     wx.stopPullDownRefresh(); //停止下拉元点

  //   }, 3000)

  // },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {

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
    return {
      title: '',
      path: '/pages/forumAdd/forumAdd',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },



})
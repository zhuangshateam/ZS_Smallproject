
// var ctx = wx.createCanvasContext("myCanvas");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    openid: '',
    loading: false,
    uploadimgs: [], //上传图片列表-
    submitHidden: true,
    opid:'',//推荐人Openid
    istrue:true,
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      uploadimgs: [],
      openid: wx.getStorageSync('openId'),
      userInfo: app.globalData.userInfo,
      opid: options.opid
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
    if (options.opid != "" || options.opid!=null){
      wx.request({  //查询当前用户是否是新用户
        url: app.globalData.api,
        data: {
          opt: 'selectNewUser_exist',
          openid: that.data.openid
        },
        success: function (res) {
          if (res.data < 1) {
            //保存当前新用户信息
            wx.request({
              url: 'https://www.izhuangsha.com/api/weixin/index.aspx',
              data: {
                opt: 'getWxNewsUserInfo_Qrcode',
                openid: that.data.openid,
                opid: that.data.opid

              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (result) {
                console.log("已保存新用户")
              }
            })
          }
        }
      })
    }
    wx.request({  //查询当前用户是否已提交过
      url: app.globalData.api,
      data: {
        opt: 'getIsSubmission',
        openid: that.data.openid
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == 0) {
          that.setData({
            istrue: true
          })
        } else {
          that.setData({
            istrue: false
          })
        }

      }
    })
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },
  // // 图片上传
  chooseimg: function () {
    let _this = this;
    let len = 0;
    if (_this.data.uploadimgs != null) {
      len = _this.data.uploadimgs.length;
    }//获取当前已有的图片
    wx.chooseImage({
      count: 1 - len, //最多还能上传的图片数,这里最多可以上传5张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let tempFilePathsimg = _this.data.uploadimgs
        //获取当前已上传的图片的数组
        var tempFilePathsimgs = tempFilePathsimg.concat(tempFilePaths)
        //把当前上传的数组合并到原来的数组中
        _this.setData({
          uploadimgs: tempFilePathsimgs
        })

      },

      fail: function () {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        })
        return;
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
  //表单提交
  formSubmit: function (e) {
    var that = this;
    
    var bool = that.data.istrue;
    if (bool){
    for (let path of this.data.uploadimgs) {
      wx.uploadFile({
        url: app.globalData.api,
        filePath: path,
        name: 'fileName',
        formData: {
          opt: 'setfollowImage',
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
      console.log(newpath);
    }
    if (newpath == "" || newpath ==undefined) {
      wx.showToast({
        title: `请上传图片 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }

      this.setData({ submitHidden: false, loading: true, buttonClicked: true  })
      //图片
      //提交
      wx.request({
        url: app.globalData.api,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          opt: 'setfollowImage_NewsUsers', 
          openid: that.data.openid,
          opid:that.data.opid,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          form_id: e.detail.formId,
          arr: newpath
        },
        success: function (resl) {
          that.setData({ submitHidden: true, loading: false})
          wx.showToast({
            title: "提交成功,等待审核",
            icon: 'none',
            duration: 3000,
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();
              }
            });
          }, 2000)
        }
      })
    }else{
      wx.showToast({
        title: "请勿重复提交!",
        icon: 'none',
        duration: 3000,
      })
    }
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
    var that=this;
    //查看是否授权
  //   wx.getSetting({
  //     success: function (res) {
  //       if (!res.authSetting['scope.userInfo']) {
  //         //console.log("wei")
  //         wx.redirectTo({
  //           url: '../login/login?url=newUserTask&opid=' + that.data.opid,
  //         })
  //       }else{
  //         that.setData({
  //           openid: wx.getStorageSync('openid')
  //         })
  //       }
  //     }
  //   })
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
    // console.log("你点击了返回")
    // var that = this
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面

    // prevPage.setData({
    //   isShowNews: false
    // });
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
  
})
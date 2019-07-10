// pages/experienceAdd/experienceAdd.js
var util = require('../../utils/util.js');


var ctx = wx.createCanvasContext("myCanvas");
const WATERMARK_FONT = '@we-cropper'
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    openid: '',
    star: 0, //评分
    starMap: [ //评分
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    star1: 0, //评分
    starMap1: [ //评分
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    showView: true, //view是否显示
    isRuleTrue: false,
    isRuleTrue1: false,
    date: util.formatTime(new Date()), //日期选择-默认起始时间
    date2: util.formatTime(new Date()),
    min: 5, //最少字数
    max: 5000, //最多字数 (根据自己需求改变)
    currentWordNumber1: 0,   //文本框内字数统计
    currentWordNumber2: 0,   //文本框内字数统计
    currentWordNumber3: 0,   //文本框内字数统计
    currentWordNumber4: 0,   //文本框内字数统计
    index: null,
    uploadimgs: [], //上传图片列表-
    imageSrc: '',
    submitHidden: true,
    loading: false,
    ishidden: false //textarea穿透
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/experienceAdd_0', '进入体验发布页面');//获取用户轨迹
    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var s3 = day3.getFullYear() + "/" + (day3.getMonth() + 1) + "/" + day3.getDate();
    this.setData({
      uploadimgs: [],
      openid: wx.getStorageSync('openId'),
      userInfo: app.globalData.userInfo,
      date2: s3
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
  //更新name

  changeData: function (imlist) {
    var ilist = this.data.uploadimgs;
    ilist.push(imlist);
    this.setData({
      uploadimgs: ilist
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  //评分
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  //销售评分
  myStarChoose1(e) {
    let star1 = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star1: star1,
    });
  },
  //打开规则提示
  showRule: function() {
    this.setData({
      isRuleTrue: true,
      showView: false

    })
  },
  showRule1: function() {
    this.setData({
      isRuleTrue1: true,
      showView: false

    })
  },
  //关闭规则提示
  hideRule: function() {
    this.setData({
      isRuleTrue: false,
      showView: true
    })
  },
  hideRule1: function() {
    this.setData({
      isRuleTrue1: false,
      showView: true
    })
  },
  //日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })

  },
  //性别
  radioSexChange: function(e) {
    console.log('radio性别事件，携带value值为：', e.detail.value)
  },
  //年龄
  sliderchange: function(e) {
    //获取滑动后的值
    //console.log(e.detail.value);
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
  txt_inputs1: function(e) {
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
      })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber1: len //当前字数  
    });

  },
  txt_inputs2: function (e) {
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
      })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber2: len //当前字数  
    });

  },
  txt_inputs3: function (e) {
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
      })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber3: len //当前字数  
    });

  },
  txt_inputs4: function (e) {
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
      })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber4: len //当前字数  
    });

  },
  //表单提交
  formSubmit: function (e) {
    //console.log("进入作文")
    if (e.detail.value.productName.length == 0) {
      wx.showToast({
        title: `请填写产品名称 `,
        image: 
        
        '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (this.data.star == 0) {
      wx.showToast({
        title: `请给该产品评分 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.txtName_pf.length == 0) {
      wx.showToast({
        title: `请填写皮肤特征 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.txtName_qz.length == 0) {
      wx.showToast({
        title: `请填写产品气质 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.txtName_ty.length == 0) {
      wx.showToast({
        title: `请填写使用体验 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    } else if (e.detail.value.txtName_ty.length < 80) {
      wx.showToast({
        title: `体验80字以上`,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.txtName_tg.length == 0) {
      wx.showToast({
        title: `请填写市场建议 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    } else if (e.detail.value.txtName_tg.length < 80) {
      wx.showToast({
        title: `市场建议80字以上`,
        icon: 'none',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.txtName_xfz.length == 0) {
      //console.log(star);
      wx.showToast({
        title: `请填写销售话术 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    } else if (e.detail.value.txtName_xfz.length < 80) {
      wx.showToast({
        title: `销售话术80字以上`,
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var that = this
    const array = []
    for (let path of this.data.uploadimgs) {
      wx.uploadFile({
        url: app.globalData.api,
        filePath: path,
        name: 'fileName',
        formData: {
          opt: 'postWxMessageImages',
          images: path
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //that.setData({ submitHidden: true })
          var data = res.data
          //console.log(data)
          //var json = JSON.parse(res.data); //
        }
      })
      var str = path;
      var obj = str.lastIndexOf("/");
      var newpath = str.substr(obj + 1);
      //console.log(newpath);
      array.push(newpath)
    }
    if (array.length == 0) {
      wx.showToast({
        title: `请上传图片 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    this.setData({
      submitHidden: false,
      loading: true
    })
    var _jsonData = {
      radio_name: 2,
      openid: this.data.openid,
      nickName: app.globalData.userInfo.nickName,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      productName: e.detail.value.productName,
      score: this.data.star,
      sales_score: this.data.star1,
      datetime: this.data.date,
      date2end: this.data.date2,
      sex: e.detail.value.gender,
      slider: e.detail.value.slider,
      txtName_pf: e.detail.value.txtName_pf,
      txtName_qz: e.detail.value.txtName_qz,
      txtName_ty: e.detail.value.txtName_ty,
      txtName_tg: e.detail.value.txtName_tg,
      txtName_xfz: e.detail.value.txtName_xfz,
      form_id: e.detail.formId,
    }
    //提交
    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        opt: 'postWxMessageImages_composition',
        _jsonData: JSON.stringify(_jsonData),
        array: array.join(",")
      },
      success: function (res) {
        //console.log(res.data.status)
        if (res.data.status == 2) {
          that.setData({
            submitHidden: true,
            loading: false
          })
          wx.showToast({
            title: "发表成功，积分+30",
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

          // wx.reLaunch({   关闭所有页面，打开应用内的某个页面，
          //   url: '../index/index',
          // })
          that.setData({
            form1_info: '',
            star: 0,
            star1: 0,
            uploadimgs: [],
            items: [{
              name: 'BA经验',
              value: '1'
            },
            {
              name: 'BA体验',
              value: '2',
              checked: 'true'
            },
            ],
            slider: 0,
          })
          // wx.showToast({
          //   title: "积分+30",
          //   duration: 3000,
          // })
          // wx.request({
          //   url: app.globalData.api,
          //   data: {
          //     opt: "setcommIntegral",
          //     openid: app.globalData.openid,
          //     integralCont: 30
          //   },
          //   success: function (res) {
          //     console.log(res);
          //     if (res.data.status === 1) {
          //       //console.log("积分+30")
          //       wx.showToast({
          //         title: "积分+30",
          //         duration: 3000,
          //       })
          //     }
          //   }
          // })
        } else {
          that.setData({
            submitHidden: true,
            loading: false
          })
          wx.showToast({
            title: '提交失败请重试',
            icon: 'loading',
            duration: 2000
          });
        }

      },
      fail: function () {
        that.setData({
          submitHidden: true,
          loading: false
        })
        wx.showToast({
          title: '网络不通畅',
          icon: 'loading',
          duration: 2000
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
  onPullDownRefresh() {

    setTimeout(() => {

      wx.stopPullDownRefresh(); //停止下拉元点

    }, 3000)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '',
      path: '/pages/experienceAdd/experienceAdd',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
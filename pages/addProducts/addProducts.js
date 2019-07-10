// pages/addProducts/addProducts.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    uploadimgs: [], //上传图片列表-海报
    detail_uploadimg: [], //产品详情上传图片列表-
    submitHidden: true,
    max:300,
    currentWordNumber: 0,   //文本框内字数统计
    imageSrc: '',
    show: true,  //textarea层级过高，内容穿透
    istarea: false,  //textarea穿透
    /***获取预览数据 */
    product_Name:'',
    trial_quantity:'',
    product_Specifications:'',
    retail_Price:'',
    main_functions:'',
    app_rules:'',
    details_introduce:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/addProducts_0', '点击我的审核中的发布产品按钮');//获取用户轨迹
    this.setData({
      uploadimgs: [],
      detail_uploadimg:[],
      userInfo: app.globalData.userInfo,
    })
  },
  handleTap() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          imageSrc: tempFilePaths[0],
          istarea: true
        })
      }
    })
  },
  cropperDone(e) {
    var imgcont = this.data.uploadimgs.length;
    console.log(imgcont)
    if (imgcont<1){
      const { src, cropperData } = e.detail;
      this.setData({
        uploadimgs: this.data.uploadimgs.concat(src)
      })
    }else{
      wx.showToast({
        title: `最多选择一张`,
        image: '/images/Tips.png',
        duration: 2000
      })
    }
  
    // wx.previewImage({
    //   current: '', // 当前显示图片的http链接
    //   urls: [src] // 需要预览的图片http链接列表
    // })
  },
  cropperCancel() {
    this.setData({
      istarea: false
    })
    console.log('cancel');
  },
  //字数限制  
  txt_inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  // 产品名称
  titleBind: function (e) {
    this.setData({
      product_Name: e.detail.value,
    })
    console.log("昵称" + e.detail.value);
  }, 
  //试用数量
  trial_quantityBind: function(e) {
    this.setData({
      trial_quantity: e.detail.value,
    })
  },
  //规格
  specificationsBind: function (e) {
    this.setData({
      product_Specifications: e.detail.value,
    })
  },
  //规格
  specificationsBind: function (e) {
    this.setData({
      product_Specifications: e.detail.value,
    })
  },
  //零售指导价
  priceBind: function (e) {
    this.setData({
      retail_Price: e.detail.value,
    })
  },
  //主要功效
  functionsBind:function(e){
    this.setData({
      main_functions: e.detail.value,
    })
  },
  //申请规则
  rulesInput:function(e){
    this.setData({
      app_rules: e.detail.value,
    })
  },
  //详情
  txtInput:function(e){
    this.setData({
      details_introduce: e.detail.value,
    })
  },
  //预览
  previewData: function (e) {
    wx.navigateTo({
      url: '/pages/preview/preview?title=' + this.data.product_Name + '&trial_quantity=' + this.data.trial_quantity + '&specifications=' + this.data.product_Specifications + '&retail_Price=' + this.data.retail_Price + '&main_functions=' + this.data.main_functions + '&app_rules=' + this.data.app_rules + '&details_introduce=' + this.data.details_introduce + '&uploadimgs=' + this.data.uploadimgs + '&detail_uploadimg=' + this.data.detail_uploadimg,
    })
  },
  //表单提交
  formSubmit: function (e) {
    //console.log(e.detail.value.title)
    if (e.detail.value.title.length == 0) {
      wx.showToast({
        title: `请填写产品名称 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.trial_quantity.length == 0) {
      wx.showToast({
        title: `请填写数量 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.specifications.length == 0) {
      wx.showToast({
        title: `请填写规格 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.retail_Price.length == 0) {
      wx.showToast({
        title: `请填写零售指导价 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    if (e.detail.value.main_functions.length == 0) {
      wx.showToast({
        title: `请填写功效 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    } 
    if (e.detail.value.app_rulesTxt.length == 0) {
      wx.showToast({
        title: `请填写申请规则 `,
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
        name: 'fileImgs',
        formData: {
          opt: 'getUploadimgs_poster',
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
    const arr_list = [];
    //产品详情图片
    for (let path of this.data.detail_uploadimg) {
      wx.uploadFile({
        url: app.globalData.api,
        filePath: path,
        name: 'fileImgs_pro',
        formData: {
          opt: 'getUploadimgs_poster_pro',
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
      arr_list.push(newpath)
    }
    //图片上传
    //将选择的图片组成一个Promise数组，准备进行并行上传
    if (arr.length == 0 && arr_list.length==0) {
      wx.showToast({
        title: `请上传图片 `,
        image: '/images/Tips.png',
        duration: 2000
      })
      return false
    }
    //提交
    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        opt: 'setProductSubmit',
        openid: app.globalData.openid,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        title: e.detail.value.title,
        trial_quantity: e.detail.value.trial_quantity,//试用数量
        specifications: e.detail.value.specifications,//产品规格
        retail_Price: e.detail.value.retail_Price,  //零售指导价格
        main_functions: e.detail.value.main_functions, //主要功效
        app_rules: e.detail.value.app_rulesTxt,   //申请规则
        textarea: e.detail.value.textarea, //产品详情
        form_id: e.detail.formId,
        arr: arr.join(","),
        arr_list:arr_list.join(",")
      },
      success: function (requestRes) {
        that.setData({ submitHidden: true })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.switchTab({
          url: '../welfare/welfare',
          success(res) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) {
              return
            }
            page.onLoad();
          }
        })
        // setTimeout(function () {
        //   // wx.navigateTo({
        //   //   url: '/pages/ToExamine/ToExamine'
        //   // })
        //  // let url = "xx/xx/xx";
          

        // }, 1000)
        that.setData({
          form_info: '',
          uploadimgs: [],
          detail_uploadimg:[]
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
      count: 4,
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
    //console.log(e.target.dataset.idx);
    const idx = e.target.dataset.idx
    const images = this.data.uploadimgs
    //console.log(images)
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
    var that = this;
    //console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    const imgs = that.data.uploadimgs;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          imgs.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          uploadimgs: imgs
        });
      }
    })

    // Array.prototype.remove = function (i) {
    //   const l = this.length;
    //   if (l == 1) {
    //     return []
    //   } else if (i > 1) {
    //     return [].concat(this.splice(0, i), this.splice(i + 1, l - 1))
    //   }
    // }
    // console.log(imgs)
    // this.setData({
    //   uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    // })
  },

  chooseImage_details: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照', '取消'],
      itemColor: "#D8497C",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage_detail('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage_detail('camera')
          }
        }
      }
    })
  },
  chooseWxImage_detail: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [type], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imgeList = that.data.detail_uploadimg.concat(res.tempFilePaths);
        that.setData({
          detail_uploadimg: imgeList
        });
      }
    })
  },
  handleImagePreview_dtl(e) {
    //console.log(e.target.dataset.idx);
    const idx = e.target.dataset.idx
    const images = this.data.detail_uploadimg
    //console.log(images)
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  editImage_details: function () {
    this.setData({
      editable_dtl: !this.data.editable_dtl
    })
  },
  deleteImg_details: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.detail_uploadimg
    Array.prototype.remove = function (i) {
      const l = this.length;
      if (l == 1) {
        return []
      } else if (i > 1) {
        return [].concat(this.splice(0, i), this.splice(i + 1, l - 1))
      }
    }
    this.setData({
      detail_uploadimg: imgs.remove(e.currentTarget.dataset.index)
    })
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

  }
})
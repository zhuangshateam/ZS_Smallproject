var util = require('../../utils/util.js');
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    id: '',
    min: 5,//最少字数
    max: 5000, //最多字数 (根据自己需求改变)
    items: [
      { name: 'BA日记', value: '1', checked: 'true' },
      { name: 'BA作文', value: '2' },
    ],
    uploadimgs: [], //上传图片列表-
    submitHidden: true,
    showView: true,  //view是否显示
    star: 0,      //评分
    starMap: [    //评分
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    star1: 0,      //评分
    starMap1: [    //评分
      '1',
      '2',
      '3',
      '4',
      '5',
    ],
    date: util.formatTime(new Date()), //日期选择-默认起始时间
    date2: util.formatTime(new Date()),
    currentWordNumber: 0,   //文本框内字数统计
    // nickname:''
    slider: '',
    isRuleTrue: false,
    isRuleTrue1: false,
    reviewTitle: '', 
    reviewcontent:'',
    guid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var s3 = day3.getFullYear() + "/" + (day3.getMonth() + 1) + "/" + day3.getDate();
    this.setData({
      uploadimgs: [],
      userInfo: app.globalData.userInfo,
      date2: s3,
      id: options.nid,
    })
    //BA日记
    this.WxValidate = app.WxValidate(
      {
        title: {
          required: true,
        },
        textarea: {
          required: true,
        }
      }
      , {
        title: {
          required: '请填写标题',
        },
        textarea: {
          required: '请填写内容',
        }
      }
    )
    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        opt: 'getBArijiNews',
        id:that.data.id
      },
      success: function (res) {
        //console.log(res.data.ds["ReviewTitle"])
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              reviewTitle: res.data.ds[i]["ReviewTitle"],
              reviewcontent: res.data.ds[i]["Reviewcontent"],
              guid: res.data.ds[i]["guid"]
            });
          }
         wx.request({
           url: app.globalData.api,
           data: {
             opt: 'getBArijiImage',
             guid: that.data.guid
           },
           success: function (result) {
             var list = that.data.uploadimgs;
             if (result.data.status === 0) {
               for (var j = 0; j < result.data.ds.length; j++) {
                 console.log(result.data.ds[j]["imagesUrl"])
                 list.push(result.data.ds[j]["imagesUrl"]);   
              }
              that.setData({
                uploadimgs:list
              })
             }
           }, error: function () {
             wx.showToast({
               title: '服务器错误',
               icon: 'loading',
               duration: 1500
             });
           }
         })
        }else{
          wx.showToast({
            title: '网络错误请重试',
            icon: 'loading',
            duration: 1500
          });
        }
      } , error: function () {
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 1500
        });
      }
    })
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
  //表单提交
  formSubmit: function (e) {
      if (!this.WxValidate.checkForm(e.detail.value)) {
        const error = this.WxValidate.errorList[0]
        // `${error.param} : ${error.msg} `
        wx.showToast({
          title: `${error.msg} `,
          image: '/images/Tips.png',
          duration: 2000
        })
        return false;
      }
      var that = this;
      const arr = [];
      this.setData({ submitHidden: false })
      for (let path of this.data.uploadimgs) {
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
            //console.log(fail);
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
          opt: 'setUpdateBADiary',
          id: that.data.id,
          guid: that.data.guid,
          title: e.detail.value.title,
          radio_name: e.detail.value.radio_name,
          textarea: e.detail.value.textarea,
          openid: app.globalData.openid,
          datetime: this.data.date,
          form_id: e.detail.formId,
          arr: arr.join(",")
        },
        success: function (requestRes) {
          that.setData({ submitHidden: true })
          wx.showToast({
            title: "修改成功",
            duration: 3000,
          })
          wx.navigateBack(); 

        },
        fail: function () {
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
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
      }
    })
  },
  handleImagePreview(e) {
    //console.log(e.target.dataset.idx);
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
    var that = this;
    //console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    Array.prototype.remove = function (i) {
      const l = this.length;
      if (l == 1) {
        return []
      } else if (i > 1) {
        return [].concat(this.splice(0, i), this.splice(i + 1, l - 1))
      }
    }
    wx.request({   //删除
      url: app.globalData.api,
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        opt: 'getBArijiImage',
        guid: this.data.guid
      },
      success: function (res) {
        if (res.data.status === 0) {
          // console.log(res.data.ds[e.currentTarget.dataset.index]["id"])
          var gid=res.data.ds[e.currentTarget.dataset.index]["id"];

          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getDeleteImage',
              gid: gid
            },
            success: function (result) {
              that.setData({
                uploadimgs: []
              })
              wx.request({
                url: app.globalData.api,
                data: {
                  opt: 'getBArijiImage',
                  guid: that.data.guid
                },
                success: function (result) {
                  //var list = that.data.uploadimgs;
                  console.log(result.data.ds)
                  if (result.data.status === 0) {
                    for (var j = 0; j < result.data.ds.length; j++) {
                      console.log(result.data.ds[j]["imagesUrl"])
                      that.data.uploadimgs.push(result.data.ds[j]["imagesUrl"]);
                    }
                    that.setData({
                      uploadimgs: that.data.uploadimgs
                    })
                  }
                }, error: function () {
                  wx.showToast({
                    title: '服务器错误',
                    icon: 'loading',
                    duration: 1500
                  });
                }
              })
            }
          })
        }
      }
    })

  },
  sliderchange: function (e) {
    //获取滑动后的值
    console.log(e.detail.value);
  },
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    if (e.detail.value == '1') {
      this.setData({
        showView: true,
        uploadimgs: [],
      })
    } else {
      this.setData({
        showView: false,
        uploadimgs: [],
      })
    }
  },
  radioSexChange: function (e) {
    console.log('radio性别事件，携带value值为：', e.detail.value)
  },
  //打开规则提示
  showRule: function () {
    this.setData({
      isRuleTrue: true
    })
  },
  showRule1: function () {
    this.setData({
      isRuleTrue1: true
    })
  },
  //关闭规则提示
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
  hideRule1: function () {
    this.setData({
      isRuleTrue1: false
    })
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
      })

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
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
      path: '/pages/welcome/welcome',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
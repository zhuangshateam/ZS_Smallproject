var util = require('../../utils/util.js');
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({
  data: {
    userInfo: '',
    min: 5,//最少字数
    max: 5000, //最多字数 (根据自己需求改变)
    items: [
      { name: 'BA日记', value: '1' },
      { name: 'BA作文', value: '2', checked: 'true'},
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
    slider: '',
    isRuleTrue: false,
    isRuleTrue1: false,
    cid:'',
    /**下面是读取作文修改信息**/
    guid:'',
    productName:'',  //产品名称
    // score:0,//
    // sales_score:0,
    sliderAge:0,
    experienceTime:'',
    datetimeEnd:'',
    sex:1,
    experientialSkin:'',//体验者皮肤
    // productQuality:'',//产品品质
    productMakings:'',//气质
    usersExperience:'',//使用体验
    productExtension:'',//产品推广
    consumer:'',//消费者
    ishidden: false,//textarea穿透
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
      cid: options.cid
    })

    wx.request({
      url: app.globalData.api,
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        opt: 'getBAZuoWenNews',
        id: that.data.cid
      },
      success: function (res) {
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              guid: res.data.ds[i]["guid"],
              productName: res.data.ds[i]["productName"],
              star: res.data.ds[i]["score"],
              star1: res.data.ds[i]["sales_score"],
              sliderAge: res.data.ds[i]["sliderAge"],
              sex: res.data.ds[i]["sex"],
              experientialSkin: res.data.ds[i]["experientialSkin"],
              productMakings: res.data.ds[i]["productMakings"],
              usersExperience: res.data.ds[i]["usersExperience"],
              productExtension: res.data.ds[i]["productExtension"],
              consumer: res.data.ds[i]["consumer"],
             
            });
            var d = new Date(res.data.ds[i]["experienceTime"]);
            var times_start = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
            var dd = new Date(res.data.ds[i]["datetimeEnd"]);
            var times_end = dd.getFullYear() + '/' + (dd.getMonth() + 1) + '/' + dd.getDate();
            that.setData({
              experienceTime: times_start,
              datetimeEnd: times_end,
            })

          }
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getBAcompositionImage',
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
                  uploadimgs: list
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
        } else {
          wx.showToast({
            title: '网络错误请重试',
            icon: 'loading',
            duration: 1500
          });
        }
      }, error: function () {
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
          ishidden: true
        })
      }
    })
  },
    //表单提交
  cropperDone(e) {
    this.setData({
      ishidden: false
    })
    const { src, cropperData } = e.detail;
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
  //表单提交
  formSubmit: function (e) {
      if (e.detail.value.productName.length == 0) {
        wx.showToast({
          title: `请填写产品名称 `,
          image: '/images/Tips.png',
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
      // if (e.detail.value.txtName_pz.length == 0) {
      //   wx.showToast({
      //     title: `请填写产品品质 `,
      //     image: '/images/Tips.png',
      //     duration: 2000
      //   })
      //   return false
      // } else if (e.detail.value.txtName_pz.length < 80) {
      //   wx.showToast({
      //     title: `品质80字以上`,
      //     image: '/images/Tips.png',
      //     duration: 2000
      //   })
      //   return false
      // }
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
          title: `请填写产品推广 `,
          image: '/images/Tips.png',
          duration: 2000
        })
        return false
      } else if (e.detail.value.txtName_tg.length < 80) {
        wx.showToast({
          title: `推广80字以上`,
          image: '/images/Tips.png',
          duration: 2000
        })
        return false
      }
      if (e.detail.value.txtName_xfz.length == 0) {
        console.log(star);
        wx.showToast({
          title: `请填写消费者 `,
          image: '/images/Tips.png',
          duration: 2000
        })
        return false
      } else if (e.detail.value.txtName_xfz.length < 80) {
        wx.showToast({
          title: `消费者80字以上`,
          image: '/images/Tips.png',
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
        console.log(newpath);
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
      console.log(that.data.guid)
      this.setData({ submitHidden: false })
      //图片上传
      //将选择的图片组成一个Promise数组，准备进行并行上传
      //if (this.data.uploadimgs.length === 0) {
      //提交
      wx.request({
        url: app.globalData.api,
        method: 'POST',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          opt: 'setUpdateBAcomposition',
          cid: this.data.cid,
          guid: this.data.guid,
          radio_name: e.detail.value.radio_name,
          openid: app.globalData.openid,
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
          array: array.join(",")
        },
        success: function (requestRes) {
          console.log(requestRes.data);
          console.log(requestRes.data.status)
          that.setData({ submitHidden: true })
          wx.showToast({
            title: "修改成功",
            duration: 3000,
          })
          wx.navigateBack(); 
        },
        fail: function () {
          that.setData({ submitHidden: false })
          wx.showToast({
            title: '修改失败',
            icon: 'loading',
            duration: 1500
          });
        },
        complete: function () {
        }
      })
  },
  // chooseImage: function () {
  //   let _this = this;
  //   wx.showActionSheet({
  //     itemList: ['从相册中选择', '拍照', '取消'],
  //     itemColor: "#D8497C",
  //     success: function (res) {
  //       if (!res.cancel) {
  //         if (res.tapIndex == 0) {
  //           _this.chooseWxImage('album')
  //         } else if (res.tapIndex == 1) {
  //           _this.chooseWxImage('camera')
  //         }
  //       }
  //     }
  //   })
  // },
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
          var gid = res.data.ds[e.currentTarget.dataset.index]["id"];

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
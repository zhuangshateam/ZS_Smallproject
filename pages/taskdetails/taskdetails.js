var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],//详情内容
    id: '',  //详情ID
    loading: false,
    hbimgUrl: '',
    imgUrl:'https://www.izhuangsha.com/',
    copNumber:'',//数量
    product_Name:'',//产品名称
    taskCommisNum:0,  //佣金
    openid: '',
    imagesUrl:'',
    isshare:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/taskdetails_0', '进入佣金任务详情页面');//获取用户轨迹
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    this.setData({
      id: options.id,
      openid: wx.getStorageSync('openId')
    })
    // 获取详情信息
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getTasksListID',
        id: that.data.id
      },
      success: function (res) {
        //console.log(res.data.ds)
        var taskList = that.data.taskList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            var article = res.data.ds[i].Details_introduce;
            WxParse.wxParse('article', 'html', article, that, 5);
            taskList.push(res.data.ds[i]);
            that.setData({
              product_Name: res.data.ds[i]["Product_Name"],
              taskCommisNum: res.data.ds[i]["taskCommisNum"],
              copNumber: res.data.ds[i]["task_quantity"],
              imagesUrl: res.data.ds[i]["imagesUrl"]
            })
            // 加载小数点
            res.data.ds[i]["Retail_Price"] = util.toFix(res.data.ds[i]["Retail_Price"], 2)
          }
          //console.log(dateilsList.length)
          that.setData({
            taskList: taskList,

          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "请检查网络!",
          icon: 'none'
        })
      },//请求失败
    })

    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },
  formSubmit: function (e) {
    var that = this
    var formId = e.detail.formId;
    var that = this
    that.setData({
      loading: true
    })
    // 判断是否提交过申请
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getOpenidIsTuretask',
        openid: that.data.openid,
        id: that.data.id
      },
      success: function (res) {
        if (res.data == "True") {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: "你已领取过任务,请勿重复领取",
            icon: 'none',
            duration: 3000,
          })
        } else {
          wx.navigateTo({
            url: '../OntrialTask/OntrialTask?id=' + that.data.id + '&copNum=' + that.data.copNumber + '&product_Name=' + that.data.product_Name + '&taskCommisNum=' + that.data.taskCommisNum + '&formId=' + formId,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
            success: function () {
              that.setData({
                loading: false
              })
            },        //成功后的回调；
            fail: function () { },          //失败后的回调；
            complete: function () { }      //结束后的回调(成功，失败都会执行)
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
},
  // getUserSubm: function () {
  //   var that = this
  //   that.setData({
  //     loading: true
  //   })
  //   // 判断是否提交过申请
  //   wx.request({
  //     url: app.globalData.api,
  //     data: {
  //       opt: 'getOpenidIsTuretask',
  //       openid: that.data.openid,
  //       id: that.data.id
  //     },
  //     success: function (res) {
  //       if (res.data == "True") {
  //         that.setData({
  //           loading: false
  //         })
  //         wx.showToast({
  //           title: "你已领取过任务,请勿重复领取",
  //           icon: 'none',
  //           duration: 3000,
  //         })
  //       } else {
  //         wx.navigateTo({
  //           url: '../OntrialTask/OntrialTask?id=' + that.data.id + '&copNum=' + that.data.copNumber + '&product_Name=' + that.data.product_Name + '&taskCommisNum=' + that.data.taskCommisNum,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
  //           success: function () {
  //             that.setData({
  //               loading: false
  //             })
  //           },        //成功后的回调；
  //           fail: function () { },          //失败后的回调；
  //           complete: function () { }      //结束后的回调(成功，失败都会执行)
  //         })
  //       }
  //     }, fail: function (err) {
  //       wx.showToast({
  //         title: "网络错误!",
  //         icon: 'none'
  //       })
  //     },//请求失败
  //   })
  //   //console.log(that.data.id)

  // },
  // subitTask: function () {
  //   var that = this;
  //   // 判断是否提交过申请
  //   wx.request({
  //     url: app.globalData.api,
  //     data: {
  //       opt: 'getIstask_Submission',
  //       openid: app.globalData.openid,
  //       nickName: app.globalData.userInfo.nickName,
  //       avatarUrl: app.globalData.userInfo.avatarUrl,
  //       userName: e.detail.value.userName,
  //       id: that.data.id
  //     },
  //     success: function (res) {
  //       if (res.data == "True") {
  //         that.setData({
  //           loading: false
  //         })
  //         wx.showToast({
  //           title: "你已经提交过申请,勿重复提交",
  //           icon: 'none',
  //           duration: 3000,
  //         })
  //       } else {
  //         that.subitTask();
  //       }
  //     }, fail: function (err) {
  //       wx.showToast({
  //         title: "网络错误!",
  //         icon: 'none'
  //       })
  //     },//请求失败
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
  * 回到首页(分享的时候)
  */
  backHome: function () {
    wx.switchTab({
      url: '/pages/welfare/welfare'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log("wei")
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
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

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    //console.log(this.data.id)
    //console.log(this.data.guid)
    return {
      title: "【BA福利】一起做任务赚佣金吧~",
      path: '/pages/taskdetails/taskdetails?id=' + this.data.id + '&isshare=1',//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
      imageUrl: this.data.imgUrl+this.data.imagesUrl,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
      success: function (res) {
        // 转发成功
        var shareTickets = res.shareTickets;
        if (shareTickets == 0) {
          return false;
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
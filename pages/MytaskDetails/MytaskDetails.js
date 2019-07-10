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
    eid:'', //产品id
    loading: false,
    hbimgUrl: '',
    imgUrl: 'https://www.izhuangsha.com/',
    app_rules:'',
    isgoods:'',  //是否收货
    experience:'', //是否提交体验
    questionnaire:'', //是否提交问卷
    et_links:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      id: options.id,
      eid: options.eid
    })
  },
   getdata:function(){
     var that = this
     that.setData({
       taskList:[]
     })
    //console.log(that.data.id)
    // 获取详情信息
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getTasksListDetailsID',
        id: that.data.id
      },
      success: function (res) {
        console.log(res.data.ds)
        var taskList = that.data.taskList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              isgoods: res.data.ds[i]["isgoods"],
              app_rules: res.data.ds[i]["app_rules"],
              et_links: res.data.ds[i]["et_links"],
              experience: res.data.ds[i]["experience"],
              questionnaire: res.data.ds[i]["questionnaire"]
            })
            var article = res.data.ds[i].Details_introduce;
            WxParse.wxParse('article', 'html', article, that, 5);
            taskList.push(res.data.ds[i]);
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
  isokgoods:function(){
    var that=this;
    //console.log(that.data.id)
    var isgoods = that.data.isgoods;
    if (parseInt(isgoods)==0){
      wx.showToast({
        title: "未发货，无法收货",
        icon: 'none'
      })
    } else if (parseInt(isgoods) == 1){
      wx.showModal({
        title: '提示',
        content: '确定收货？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.api,
              data: {
                opt: 'getTasksconfirm',
                id: that.data.id
              },
              success: function (res) {
                that.getdata();
                
              }, fail: function (err) {
                wx.showToast({
                  title: "请检查网络!",
                  icon: 'none'
                })
              },//请求失败
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  isexperience:function(){
    var that = this;
    // var toexamine = that.data.toexamine;
    // if (parseInt(toexamine) == 0 || parseInt(toexamine) == 1) {
    //   wx.showToast({
    //     title: "请先确认收货",
    //     icon: 'none'
    //   })
    // } else {
    //   //保留当前页面，跳转到应用内的某个页面
      wx.navigateTo({
        url: '/pages/comments/comments',
      });
    //}
    

  },
  questionnaireBind:function(){
    wx.showToast({
      title: "快去完成问卷吧~",
      icon: 'none',
      duration: 2000
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
    // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       console.log("wei")
    //       wx.redirectTo({
    //         url: '../login/login',
    //       })
    //     }
    //   }
    // })
    this.getdata();
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
  // onShareAppMessage: function (res) {

  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   //console.log(this.data.id)
  //   //console.log(this.data.guid)
  //   return {
  //     title: "【BA福利】一起免费试用吧~",
  //     path: '/pages/welfareDetail/welfareDetail?id=' + this.data.id + '&guid=' + this.data.guid,//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
  //     imageUrl: this.data.hbimgUrl,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
  //     success: function (res) {
  //       // 转发成功
  //       var shareTickets = res.shareTickets;
  //       if (shareTickets == 0) {
  //         return false;
  //       }
  //       // wx.getShareInfo({
  //       //   shareTicket: shareTickets[0],
  //       //   success:function(res){
  //       //     var encryptedData = res.encryptedData;
  //       //     var iv=res.iv;
  //       //   }
  //       // })
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // }
})
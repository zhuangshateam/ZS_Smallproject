var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateilsList:[],//详情内容
    picList:[], //图片数组--头部海报
    imgLists:[],//产品详情图片数组
    id:'',  //详情ID
    guid:'',
    loading:false,
    copNumber:0,//试用份数
    numOk:0,
    //hidden: true,
    // productName:'',
    hbimgUrl:'',
    openid:'',
    isshare: 0, //分享页面显示返回首页按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/welfareDetail_0', '进入免费试用详情页面');//获取用户轨迹
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    this.setData({
      id: options.id,
      guid: options.guid,
      //hidden: false,
      openid: wx.getStorageSync('openId')
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
    // 获取海报图片
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getImgageArray',
        guid:that.data.guid
      },
      success: function (res) {
        var picList = that.data.picList;
        if (res.data.status==0){
          for (var i = 0; i < res.data.ds.length; i++) {
            picList.push(res.data.ds[i]["imagesUrl"]);
            that.setData({
              hbimgUrl: res.data.ds[i]["imagesUrl"]
            })
            //console.log(res.data.ds[i]["guid"])
          }
          that.setData({
            picList: picList
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "请检查网络!",
          icon: 'none'
        })
      }//请求失败
    })

    // 获取详情信息
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getDateilsArrayList',
        id: that.data.id
      },
      success: function (res) {
        //console.log(res.data.ds)
        var dateilsList = that.data.dateilsList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            dateilsList.push(res.data.ds[i]);
            var article = res.data.ds[i].Details_introduce;
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              // productName: res.data.ds[i]["Product_Name"],
              copNumber:res.data.ds[i]["Trial_quantity"],
              numOk: res.data.ds[i]["NumOk"],
            })
            // 加载小数点
            res.data.ds[i]["Retail_Price"] = util.toFix(res.data.ds[i]["Retail_Price"], 2)
          }
          //console.log(dateilsList.length)
          that.setData({
            dateilsList: dateilsList,

          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "请检查网络!",
          icon: 'none'
        })
      },//请求失败
    })
    // console.log(that.data.copNumber)
    // 获取产品详情图片数组
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getDateilsImgList',
        guid: that.data.guid
      },
      success: function (res) {
        var imgLists = that.data.imgLists;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            imgLists.push(res.data.ds[i]);
          }
          that.setData({
            imgLists: imgLists,
            //hidden: true,
          })
        } 
      }, fail: function (err) {
        wx.showToast({
          title: "请检查网络!",
          icon: 'none'
        })
      },//请求失败
    })
    wx.hideLoading();
  },
//预览图片
  previewImg: function (e) {
    var currentUrl = e.currentTarget.dataset.currenturl
    var previewUrls = e.currentTarget.dataset.previewurl
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: previewUrls, //必须是http图片，本地图片无效
    })
  },
  getUserSubm:function(){
    var that = this
    that.setData({
      loading:true
    })
    // 判断是否提交过申请
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getOpenidIsTure',
        openid: that.data.openid,
        id:that.data.id
      },
      success: function (res) {
        if(res.data=="True"){
          that.setData({
            loading: false
          })
          wx.showToast({
            title: "你已经提交过申请,勿重复提交",
            icon: 'none',
            duration: 3000,
          })
        }else{
          wx.navigateTo({
            url: '../Ontrial/Ontrial?id=' + that.data.id + '&copNum=' + that.data.copNumber,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
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
    //console.log(that.data.id)
    
  },

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
      title: "【BA福利】一起免费试用吧~",
      path: '/pages/welfareDetail/welfareDetail?id=' + this.data.id + '&guid=' + this.data.guid + '&isshare=1',//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
      imageUrl: this.data.hbimgUrl,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
      success: function (res) {
        // 转发成功
        var shareTickets = res.shareTickets;
        if (shareTickets == 0) {
          return false;
        }
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success:function(res){
        //     var encryptedData = res.encryptedData;
        //     var iv=res.iv;
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
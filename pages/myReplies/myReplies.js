// pages/myReplies/myReplies.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repliesList: [],     //BA日记
    repliesmakeupList: [],    //美妆点评--作文
    ishidden1: false,       //是否隐藏
    ishidden2: false,       //是否隐藏
    isShow: false,     //是否显示
    star: 0,      //评分
    isRepliesCont:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/myReplies_0', '点击了我的回帖页面');//获取用户轨迹
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    that.setData({
      isRepliesCont: options.isRepliesCont,
      repliesList: [],
      repliesmakeupList: [],
    })
    that.loadMore();
    //console.log(that.data.isPostCont)
    if (that.data.isRepliesCont == 0) {
      that.setData({
        isShow: true
      })
    }
  },
  loadMore: function () {
    var that = this;
    wx.request({  //日记
      url: app.globalData.api,
      data: {
        opt: 'getRepliesList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds);
        var list = that.data.repliesList;
        if (res.data.status == 0) {

          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            var d = new Date(list[i]["Reviewtime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["Reviewtime"] = times;
            var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid
            for (let hh of cookie_mid) {
              if (res.data.ds[i].id == hh) {//遍历找到对应的id){

                that.setData({
                  [`repliesList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
          }
          that.setData({
            repliesList: list
          })
        } else {
          that.setData({
            ishidden1: true
          })
        }
      }
    })
    wx.request({  //作文
      url: app.globalData.api,
      data: {
        opt: 'getrepliesmakeupList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.info(res.data.ds);
        var list1 = that.data.repliesmakeupList;
        if (res.data.status == 0) {

          for (var i = 0; i < res.data.ds.length; i++) {
            list1.push(res.data.ds[i]);
            var dd = new Date(list1[i]["Reviewtime"]);
            var datetimes = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            list1[i]["Reviewtime"] = datetimes;
            var zan_mid = wx.getStorageSync('is_zan') || [];   //获取全部点赞的mid
            for (let hh of zan_mid) {
              //console.log(hh)
              if (res.data.ds[i].id == hh) {//遍历找到对应的id){

                that.setData({
                  [`repliesmakeupList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
          }
          that.setData({
            repliesmakeupList: list1
          });
        } else {
          that.setData({
            ishidden2: true
          })
        }
      }
    })
    wx.hideLoading();
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
    var that = this;

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
// pages/myPosting/myPosting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postingmakeupList: [],    //美妆点评
    hidden: true,       //是否隐藏
    isShow: true,     //是否显示
    openid: '',
    isPostingCont: '',
    idshow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    this.setData({
      openid: options.openid,
      isPostingCont: options.pocounts,
    })
    if (that.data.isPostingCont == ''||that.data.isPostingCont==0) {
      that.setData({
        idshow: true
      })
    } else {
      that.setData({
        idshow: false
      })
    }
    //console.log(that.data.isPostingCont)
    // this.loadMore();
  },
  loadMore: function () {
    var that = this;
    wx.request({  //作文
      url: app.globalData.api,
      data: {
        opt: 'getpostingCompositionList',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.info(res.data.ds);
        var list1 = that.data.postingmakeupList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list1.push(res.data.ds[i]);
            console.log(list1[i]["Reviewtime"])
            var dd = new Date(list1[i]["Reviewtime"]);
            var datetimes = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            list1[i]["Reviewtime"] = datetimes;

          }
          that.setData({
            postingmakeupList: list1,
            hidden: true,
            isGet: true,

          });
        }
      }
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
    var that = this;
    wx.request({  //获取发贴
      url: app.globalData.api,
      data: {
        opt: 'getPersonalCenter',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          isPostingCont: res.data
        })
      }
    })
    this.setData({
      postingList: [],
      postingmakeupList: [],
    })
    that.loadMore();
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
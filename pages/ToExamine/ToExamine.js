// pages/myPosting/myPosting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],     //审核数据
    toexamine:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/ToExamine_0', '进入我的审核页面');//获取用户轨迹
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    //console.log(that.data.isPostingCont)
    this.loadMore();
  },
  loadMore: function () {
    var that = this;
    wx.request({  //品牌信息
      url: app.globalData.api,
      data: {
        opt: 'getproductList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data.ds);
        var list = that.data.productList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            // 日期转换
            var d = new Date(list[i]["CreateTime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["CreateTime"] = times;
            if (list[i]["Toexamine"]==1){
              that.setData({
                toexamine:false
              })
            }
            //console.log(list[i]["Toexamine"])
          }
          that.setData({
            productList: list,
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
    // wx.request({  //获取发贴
    //   url: app.globalData.api,
    //   data: {
    //     opt: 'getPersonalCenter',
    //     openid: app.globalData.openid,
    //   },
    //   success: function (res) {
    //     //console.log(res.data)
    //     that.setData({
    //       isPostingCont: res.data
    //     })
    //   }
    // })
    // this.setData({
    //   postingList: [],
    //   postingmakeupList: [],
    // })
     //that.loadMore();
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
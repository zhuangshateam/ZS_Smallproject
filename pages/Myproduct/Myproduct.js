// pages/Myproduct/Myproduct.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ptList: [],     //审核数据
    scrollHeight:0,
    isCont:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/Myproduct_0', '进入我的产品页面');//获取用户轨迹
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });

  },
  loadMore: function () {
    var that = this;
    wx.request({  //我的产品
      url: app.globalData.api,
      data: {
        opt: 'getMyproductList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data.ds);
        var list = that.data.ptList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            // 日期转换
            var d = new Date(list[i]["CreateTime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["CreateTime"] = times;
          that.setData({
            isCont: res.data.ds.length
          })
          }
          that.setData({
            ptList: list
          });
        }
      }
    })

  },
  deleteImage: function (e) {
    var that = this;
    var pid = e.currentTarget.dataset.index;//获取当前长按下标--id
    var guid = e.currentTarget.dataset.guid;//获取当前长按的guid
    wx.showModal({
      title: '提示',
      content: '确定要删除此产品？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getproductDelete',
              pid: pid,
              guid: guid
            },
            success: function (res) {
              //console.log(res.data)
              if (res.data === 1) {
                wx.showToast({
                  title: "删除成功",
                  duration: 3000,
                })
                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }

              }

            }
          })
        } else if (res.cancel) {
          return false;
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
    this.setData({
      ptList:[]
    })
    this.onLoad()
     this.loadMore();
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
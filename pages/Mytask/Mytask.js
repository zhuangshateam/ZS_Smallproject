// pages/MyTrial/MyTrial.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList: [],
    newsUserList:[],  //新用户任务
    scrollHeight: 0,
    isCont: 0,
    newCont:0,
    openid:'',
    imgUrl: 'https://www.izhuangsha.com/',
    isshare: 0, //分享页面显示返回首页按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/Mytask_0', '进入我的任务页面');//获取用户轨迹
    // if (options.isshare == 1) {
    //   console.log('是分享进入');
    //   this.setData({
    //     isshare: options.isshare
    //   })
    // }
    that.setData({
      openid: wx.getStorageSync('openId')
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    //console.log(that.data.isPostingCont)
    //this.loadMore();
  },
  /**
* 回到首页(分享的时候)
*/
  // backHome: function () {
  //   wx.switchTab({
  //     url: '/pages/home/home'
  //   })
  // },
  loadMore: function () {
    var that = this;
    wx.request({  //我的任务
      url: app.globalData.api,
      data: {
        opt: 'getMyTask', 
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data.ds);
        var list = that.data.myList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);

            that.setData({
              isCont: res.data.ds.length
            });
          }
          that.setData({
            myList: list,
          });
        }
      }
    })
    wx.request({  //我的任务--新手任务
      url: app.globalData.api,
      data: {
        opt: 'getMyNewsUser',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data.ds);
        var nlist = that.data.newsUserList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            nlist.push(res.data.ds[i]);

            that.setData({
              newCont: res.data.ds.length
            });
          }
          that.setData({
            newsUserList: nlist,
          });
        }
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  ecDetails: function (e) {
    var that = this;
    var eid = e.currentTarget.dataset.eid;
    var id = e.currentTarget.dataset.id;
// console.log(eid)
    wx.navigateTo({
      url: '/pages/MytaskDetails/MytaskDetails?id=' + id+'&eid='+eid,
    });


  },
  completeBtn:function(){
    wx.navigateTo({
      url: '/pages/newUserTask/newUserTask',
    });
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
      myList: [],
      newsUserList:[]
    })
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
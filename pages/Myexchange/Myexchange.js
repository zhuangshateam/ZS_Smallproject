// pages/MyTrial/MyTrial.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList: [],
    scrollHeight: 0,
    isCont: 0,
    imgUrl: 'https://www.izhuangsha.com/',

    // proTitle:'',
    // proImg:'',
    // interNum:'',
    // isState:0,
    // userName:'',
    // phoneNum:'',
    // address:'',
    // city:'',
    // province:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/Myexchange_0', '进入我的兑换页面');//获取用户轨迹
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
  loadMore: function () {
    var that = this;
    wx.request({  //我的兑换
      url: app.globalData.api,
      data: {
        opt: 'getMyexchange',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds);
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
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  ecDetails:function(e){
    var that=this;
    var eid = e.currentTarget.dataset.eid;

    wx.navigateTo({
      url: '/pages/MyexchangeDetails/MyexchangeDetails?id='+eid,
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
      myList:[]
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
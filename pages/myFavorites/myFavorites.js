// pages/myFavorites/myFavorites.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _FavoritesList: [],     //BA日记
    _FavoritesmakeupList: [],    //美妆点评--作文
    // isShow: true,     //是否显示
    star: 0,      //评分
    isFavoritesCount:'',  //收藏数量
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
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/myFavorites_0', '点击了我的收藏页面');//获取用户轨迹
    //console.log(that.data.isFavoritesCount);
    this.setData({
      isFavoritesCount: options.isFavoritesCount,
    })

    //this.loadMore();

  },
loadMore:function(){
  var that = this;
  wx.request({  //日记
    url: app.globalData.api,
    data: {
      opt: 'getFavoritesList',
      openid: app.globalData.openid,
    },
    success: function (res) {
      //console.log(res.data.ds);
      var list = that.data._FavoritesList;
      if (res.data.status == 0) {
        that.setData({
          _FavoritesList: res.data.ds,
        });
        for (var i = 0; i < res.data.ds.length; i++) {
          list.push(res.data.ds[i]);

          var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid
          for (let hh of cookie_mid) {
            if (res.data.ds[i].id == hh) {//遍历找到对应的id){

              that.setData({
                [`_FavoritesList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
              })
            }
          }
        }
        // if (res.data.ds.length < 3) {
        //   that.data.isAjax = false;
        // }
      }
    }
  })
  wx.request({  //作文
    url: app.globalData.api,
    data: {
      opt: 'getFavoritesZWList',
      openid: app.globalData.openid,
    },
    success: function (res) {
      //console.info(res.data.ds);
      var list = that.data._FavoritesmakeupList;
      if (res.data.status == 0) {
        that.setData({
          _FavoritesmakeupList: res.data.ds
        });
        for (var i = 0; i < res.data.ds.length; i++) {
          list.push(res.data.ds[i]);

          var zan_mid = wx.getStorageSync('is_zan') || [];   //获取全部点赞的mid
          for (let hh of zan_mid) {
            //console.log(hh)
            if (res.data.ds[i].id == hh) {//遍历找到对应的id){

              that.setData({
                [`_FavoritesmakeupList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
              })
            }
          }
        }
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
    var that=this;
    wx.request({  //获取收藏
      url: app.globalData.api,
      data: {
        opt: 'getFavoritesCount',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          isFavoritesCount: res.data
        })
      }
    })
    this.setData({
      _FavoritesList: [],
      _FavoritesmakeupList: [],
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
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    linkUrl: app.globalData.imgUrl,
    newsList: [],
    hidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    pageSize: 6,
    isAjax: true,
    isGet: true
  },
  selected: function (e) {

    this.setData({

      selected1: false,

      selected2: false,

      selected3: false,

      selected: true

    })

  },
  selected1: function (e) {

    this.setData({

      selected: false,

      selected2: false,

      selected3: false,

      selected1: true

    })

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
          parentId: options.parentId
        });
      }
    });
    this.loadMore();
  },
  //页面滑动到底部
  bindDownLoad: function () {
    if (this.data.isAjax && this.data.isGet) {
      this.loadMore();
    }
    console.log("123");
  },
  loadMore: function () {
    var that = this;
    this.setData({
      hidden: false,
      isGet: false
    });
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getArticle',
        parentId: that.data.parentId,
        page: that.data.page++,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        console.info(res.data.ds);
        var list = that.data.newsList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
          }
          that.setData({
            newsList: list,
            hidden: true,
            isGet: true
          });
          if (res.data.ds.length < 3) {
            that.data.isAjax = false;
          }
        }
        else {
          that.setData({
            hidden: true,
            isGet: false
          });
        }
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    // getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    // getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
  },
})

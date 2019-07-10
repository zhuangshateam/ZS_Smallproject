// pages/curriculum/curriculum.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    clumList:[],
    imgUrl:"https://www.izhuangsha.com",
    // hiImage:false,//加载图标是否隐藏
    inputValue:'',//搜索
    imgesUrl:'',
    page: 1,        //当前页
    pageSize: 5,    //页数
    isLoading: true,//是否显示加载数据提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    app.editTabbar();
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/curriculum_0', '进入课程');//获取用户轨迹
    wx.request({  //转发
      url: app.globalData.api,
      data: {
        opt: 'getForwardImg'
      },
      success: function (res) {
        //console.log(res.data.ds[0].titleNmae)
        that.setData({
          imgesUrl: res.data.ds[0].imgUrl
        })
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    that.getdata();
    //要延时执行的代码
    wx.hideLoading();
  },
  getdata:function(){
    var that = this;
    this.setData({
      isLoading: true,
    })
    console.log(this.data.page)
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getCurriclumList',
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        console.info(res.data.ds);
        var list = that.data.clumList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);

          }
          that.setData({
            clumList: list
          });
          if (res.data.ds.length < 5) {
            that.setData({
              isLoading: false,
            })
          } 
        }
        else {
          that.setData({
            isLoading: false,
          });
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误",
          icon: 'none',
          duration: 2000
        })
      },//请求失败
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)

  },
  //搜索方法 key为用户输入的查询字段
  search: function (key) {
    /*console.log('搜索函数触发')*/
    var that = this;
    console.log(key)
    that.setData({
      clumList:[]
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getCurrlunSearch',
        searchkey: key
      },
      success: function (res) {
        console.log(res.data.ds)
        if (res.data.status == 1) {
          wx.showToast({
            title: '暂无搜索结果',
            image: '/images/Tips.png',
            duration: 3000,
          })
        } else {
          that.setData({
            clumList: res.data.ds,
          })
        }

      }
    })
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },
  //清除输入框数据
  clearInput: function () {
    this.setData({
      inputValue: ""
    })
  },
  wxSearchInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  wxSearchFn: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    this.search(this.data.inputValue);
  },
  getCurrlunDetails:function(e){
    var clid = e.currentTarget.dataset.clid;
    var imgurl = e.currentTarget.dataset.imgurl;
    var brief = e.currentTarget.dataset.brief;
    var title = e.currentTarget.dataset.title
    console.log(title)
    console.log(brief)
    console.log(imgurl)
    //进入详情
    //跳转商品详情
    wx.navigateTo({ url: '../curriDetails/curriDetails?id=' + clid + '&imgurl=' + imgurl + '&brief=' + brief + '&titName=' + title})
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
    var that=this
    that.setData({
      clumList: []
    })
    that.getdata();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      isLoading: true,
      page: that.data.page + 1
    })
    that.getdata();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'BA专属课程',
      imageUrl: app.globalData.imgUrl + this.data.imgesUrl,//图片地址
      path: '/pages/index/index',// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
  },
})
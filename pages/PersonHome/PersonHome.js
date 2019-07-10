var app = getApp()
Page({
  data: {
    userInfo: {},
    // orderItems
    orderItems: [],
    ages:'',
    sex:'',
    person_signature:'',  //签名
    work_position:'', //职位
    work_years:'',  //年限
    ipt_city:'',//城市
    phone:'', // 手机号码
    youxiang:'',  //邮箱
    jianjie:'' , //介绍
    rexperienceCount: 0,
    compositionCount: 0,
    integral:0, //积分
  },
  onLoad: function (options) {
    //console.log('onLoad')
    var that = this
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/PersonHome_0', '进入个人主页页面');//获取用户轨迹
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.setData({
      integral: options.integral,
    })
    this.getLocation();
    that.moreLoad();
  },
  //获取地理位置
  getLocation: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
      success: function (res) {
        // success  
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=ZARuiHn0PjW6EM1bG4rUUay9rM9QyIhG&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        console.log(res);
        var city = res.data.result.addressComponent.city;
        that.setData({ ipt_city: city });
      },
      fail: function () {
        that.setData({ ipt_city: "获取定位失败" });
      },

    })
  },
  //点击进入个人已发布数据
  toOrderRep: function () {   //日记
    wx.navigateTo({
      url: '../myPosting/myPosting?isPostingCont=' + this.data.rexperienceCount,
    })
  },
  toOrderCom: function () {  //作文
    wx.navigateTo({
      url: '../myPosting/myPosting?isPostingCont=' + this.data.compositionCount
    })
  },
  moreLoad:function(){
    var that = this
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getPersonUserInfo',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds)
        if (res.data.status == 0) {
          console.log(res.data.ds)
          that.setData({
            orderItems:res.data.ds
          })
          
        }
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getPersonUser',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds)
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              ages: res.data.ds[i]["ages"],
              sex: res.data.ds[i]["sex"],
              person_signature: res.data.ds[i]["person_signature"],
              work_position: res.data.ds[i]["work_position"],
              work_years: res.data.ds[i]["work_years"],
              ipt_city: res.data.ds[i]["city"],
              phone: res.data.ds[i]["Telephone"],
              youxiang: res.data.ds[i]["emailbox"],
              jianjie: res.data.ds[i]["contentBrief"],

            });
          }

        }
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取日记数量
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getwx_userRexperienceCount',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data)
        //console.log(this.data.openid)
        that.setData({
          rexperienceCount: res.data
        })

      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //console.log(that.data.openid)
    //获取作文数量
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getuserCompositionCount',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          compositionCount: res.data
        })
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取点赞总数
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getPraiseCount',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          praiseTotal: res.data
        })
      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    //获取排行名次
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getUsersRankingTop',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res)
        if (res.data == '') {
          that.setData({
            rankingTop: 0
          })
        } else {
          that.setData({
            rankingTop: res.data
          })
        }

      },
      fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
  },
  editData:function(){
    wx.navigateTo({
      url: '/pages/myEditdata/myEditdata',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
  },
  onShow:function(){
    this.moreLoad();
  },
})
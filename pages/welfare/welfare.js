//index.js
var util = require("../../utils/util.js")
//获取应用实例
var app = getApp()
Page({
  data: {
    tabbar: {},
    lists: [],//福利
    exList: [], //积分
    taskList: [],//任务
    //controls: true//是否显示播放控件
    userInfo: '',
    isLoading: true,//是否显示加载数据提示
    page: 1,        //当前页
    pageSize: 5,    //页数
    openid: '',
    searchKeyword: '',  //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    imgUrl: '',
    imgesUrl: '',
    istask: false,
    currentTab: 0,
    len: 2
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.editTabbar();
    app.onShow();
    //获取用户轨迹
    getApp().getUserTrajectory(1, 'onLoad', 'pages/welfare_0', '进入福利页面');//获取用户轨迹
    this.setData({
      lists: [],
      userInfo: app.globalData.userInfo,
      imgUrl: app.globalData.imgUrl,
      openid: app.globalData.openid,
      openid: wx.getStorageSync('openId'),
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
        if (res.windowHeight < 600) {
          that.setData({
            len: 2.1,
          });
        };
        if (res.windowHeight > 600) {
          that.setData({
            len: 2.2,
          });
        };
        if (res.windowHeight > 700) {
          that.setData({
            len: 2.6,
          });
        }
      }
    });
    wx.request({  //转发
      url: app.globalData.api,
      data: {
        opt: 'getForwardImg'
      },
      success: function (res) {
        var imgurl = res.data.ds[0].imgUrl;
        that.setData({
          imgesUrl: imgurl
        })
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    that.getdata();
    that.getMore();
    that.getTask();
  },
  //加载福利区数据
  getdata: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getWelfare',
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        var list = that.data.lists;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);

            // 日期转换
            let d = new Date(res.data.ds[i]["CreateTime"]).getTime();
            var times = util.timeHandle(d);
            //console.log(times)
            res.data.ds[i]["CreateTime"] = times;

            //转时间戳
            // var timestamp = Date.parse(list[i]["CreateTime"]);
            // timestamp = timestamp / 1000;
            // var qq = util.getDateDiff(timestamp)
            // console.log(qq)
            //console.log("当前时间戳为：" + timestamp);
          }
          that.setData({
            lists: list
          });
          if (res.data.ds.length < 5) {
            that.setData({
              isLoading: false,
            })
          }
        } else {
          that.setData({
            isLoading: false,
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })

      },//请求失败
    })
  },
  //加载数据--积分
  getMore: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getExchange',
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        var list = that.data.exList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
          }
          that.setData({
            exList: list
          });
          if (res.data.ds.length < 5) {
            that.setData({
              isLoading: false,
            })
          }
        } else {
          that.setData({
            isLoading: false,
          })
        }

      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })
      },//请求失败
    })
  },
  //加载数据--佣金任务
  getTask: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getTaskList',
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {

        var tlist = that.data.taskList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            tlist.push(res.data.ds[i]);
          }
          that.setData({
            taskList: tlist,
            istask: true
          });
          if (res.data.ds.length < 5) {
            that.setData({
              isLoading: false,
            })
          }
        } else {
          that.setData({
            isLoading: false,
          })
        }

      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })
      },//请求失败
    })
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 1000) //延迟时间 这里是1秒
  },
  //进入详情--试用
  detail: function (e) {
    //console.log(e.currentTarget.dataset.did)
    var id = e.currentTarget.dataset.did
    var guid = e.currentTarget.dataset.guid
    wx.navigateTo({
      url: '../welfareDetail/welfareDetail?id=' + id + '&guid=' + guid
    })
  },
  //进入详情--积分
  catchTapCategory: function (e) {
    var that = this;
    var eid = e.currentTarget.dataset.eid;
    console.log('goodsId:' + eid);
    //跳转商品详情
    wx.navigateTo({ url: '../exchange_details/exchange_details?id=' + eid })
  },
  //进入详情--佣金
  taskdetail: function (e) {
    var that = this;
    var tid = e.currentTarget.dataset.tid;
    console.log('goodsId:' + tid);
    //跳转佣金任务详情
    wx.navigateTo({ url: '../taskdetails/taskdetails?id=' + tid })

  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      lists: [],//福利
      exList: [], //积分
      taskList: [],//任务
      page: 1
    })
    wx.showLoading({
      title: '刷新中',
    })
    this.getdata();
    this.getMore();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideLoading();
  },
  // 导航栏切换
  tabNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    }
    //console.log(e.target.dataset.current)
    if (e.target.dataset.current == 0) {
      this.setData({

        currentTab: e.target.dataset.current
      })
    } else if (e.target.dataset.current == 1) {
      that.setData({

        currentTab: e.target.dataset.current
      })
      console.log(this.data.currentTab)
    } else if (e.target.dataset.current == 2) {
      that.setData({

        currentTab: e.target.dataset.current
      })
      // this.getdata();
    }

  },
  bindChange: function (e) {
    var that = this;
    console.log(e.detail.current)
    if (e.detail.current == 0) {
      this.setData({
        currentTab: e.detail.current,
      })
      // that.getdata();
      return false;
    } else if (e.detail.current == 1) {
      this.setData({
        currentTab: e.detail.current
      })
    }
    else {
      this.setData({
        currentTab: e.detail.current
      })
    }
    that.setData({ currentTab: e.detail.current });


  },
  /**
 * 页面上拉触底事件的处理函数
 */
  bindDownLoad0: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      isLoading: true,
      page: that.data.page + 1
    })
    that.getdata();
  },
  bindDownLoad1: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      isLoading: true,
      page: that.data.page + 1
    })
    that.getMore();
  },
  bindDownLoad2: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    that.setData({
      isLoading: true,
      page: that.data.page + 1
    })
    that.getTask();
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: 'BA专属福利',
      imageUrl: app.globalData.imgUrl + this.data.imgesUrl,//图片地址
      path: '/pages/welfare/welfare',// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
  }
})

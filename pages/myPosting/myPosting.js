// pages/myPosting/myPosting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postingList: [],     //BA日记
    postingmakeupList: [],    //体验
    ishidden1: false,       //是否隐藏
    ishidden2: false,       //是否隐藏
    isShow: false,     //是否显示
    star: 0,      //评分
    isPostCont:0,
    openid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/myPosting_0', '点击了我的发帖页面');//获取用户轨迹
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
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
    this.setData({
      postingList: [],
      postingmakeupList: [],
      isPostCont: options.isPostingCont
    })
    //that.loadMore();

    //console.log(that.data.isPostCont)
    if (that.data.isPostCont==0) {
      that.setData({
        isShow: true
      })
    }
  },
  loadMore:function(){
    var that = this;
    wx.request({  //日记
      url: app.globalData.api,
      data: {
        opt: 'getpostingNewsList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds);
        var list = that.data.postingList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]); 
            var d = new Date(list[i]["Reviewtime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["Reviewtime"] = times;
            
          }
          that.setData({
            postingList: list
          });
        }else{
          that.setData({
            ishidden1:true
          })
        }
      }
    })
    wx.request({  //作文
      url: app.globalData.api,
      data: {
        opt: 'getpostingCompositionList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.info(res.data.ds);
        var list1 = that.data.postingmakeupList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list1.push(res.data.ds[i]);
            //console.log(list1[i]["Reviewtime"])
            var dd = new Date(list1[i]["Reviewtime"]);
            var datetimes = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            list1[i]["Reviewtime"] = datetimes;

          }
          that.setData({
            postingmakeupList: list1
          });
        } 
      }
    })
    wx.hideLoading();
  },
  bindViewTab: function (options){   //日记修改页面
    var id = options.currentTarget.dataset.id;//此处找到列表的id
    //console.log(id)
    wx.navigateTo({
      url: '/pages/newsUpdate/newsUpdate?nid=' + id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
   })
  },
  bacompEdit: function (options){ //作文修改页面
    var id = options.currentTarget.dataset.id;//此处找到列表的id
    //console.log(id)
    wx.navigateTo({
      url: '/pages/compositionUpdate/compositionUpdate?cid=' + id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
  },
  deleteClick: function (options){  //日记删除
    var that=this;
    var nid = options.currentTarget.dataset.nid;//此处找到列表的id
    wx.showModal({
      title: '提示',
      content: '删除日记将会扣减积分,确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getdelete',
              nid: nid,
              openid: that.data.openid
            },
            success: function (res) {
              console.log(res.data)
              if (res.data === 1) {

                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
                wx.showToast({
                  title: "删除成功",
                  duration: 3000,
                })
              }

            }
          })
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    //console.log(nid)
    
  },
  bacompDelete: function (options){  //作文删除
    var that = this;
    var cid = options.currentTarget.dataset.cid;//此处找到列表的id
    //console.log(nid)
    wx.showModal({
      title: '提示',
      content: '删除作文将会扣减积分,确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getZWdelete',
              cid: cid,
              openid: that.data.openid
            },
            success: function (res) {
              console.log(res.data)
              if (res.data === 1) {

                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
                wx.showToast({
                  title: "删除成功",
                  duration: 3000,
                })
              }

            }
          })
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    
  },
  // //页面滑动到底部
  // bindDownLoad: function () {
  //   if (this.data.isAjax && this.data.isGet) {
  //     this.loadMore();
  //   }
  // },
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
    that.setData({
      postingList: [],     //BA日记
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
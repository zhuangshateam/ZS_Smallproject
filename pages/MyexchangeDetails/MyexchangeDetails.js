// pages/TipsBox/TipsBox.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecdList:[],
    id:'',
    //commid:'',
    imageurl: 'https://www.izhuangsha.com/',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      id: options.id
    })
    console.log(that.data.id)
    that.getdata();
  },
  getdata: function () {
    var that = this;
    wx.request({  //我的兑换
      url: app.globalData.api,
      data: {
        opt: 'getExchange_detailsId',
        eid: that.data.id,
      },
      success: function (res) {
        console.log(res.data.ds);
        var list = that.data.ecdList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            // that.setData({
            //   commid: res.data.ds[i]["commId"]
            // })
            list.push(res.data.ds[i]);
          }
          that.setData({
            ecdList: list,
          });
        }else{
          wx.showToast({
            title: '获取信息错误',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 3000,
          mask: true
        })
      },//请求失败
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
  determine:function(){
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    var eid=that.data.id;
    wx.request({  
      url: app.globalData.api,
      data: {
        opt: 'setMyexchangeUpdate',
        eid: eid,
      },
      success: function (res) {
        //console.log(res.data);
        // if (res.data==1){
        //   that.setData({
        //     ecdList:[]
        //   })
        
        wx.navigateBack({
          delta: 1
        });//返回上一页
        // }  
        
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    
  },
  addressUpdate:function(){
    // var commid = this.data.commid
    // console.log(commid)
    wx.redirectTo({
      url: '/pages/exchangeMore/exchangeMore'
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
    // this.setData({
    //   ecdList: []
    // })
    // this.getdata();
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
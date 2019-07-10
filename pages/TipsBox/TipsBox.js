// pages/TipsBox/TipsBox.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    userName:'',
    phoneNum:'',
    city:'',
    province:'',
    address:'',
    id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      openid: options.openid
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
    //that.getdata();
  },
  getdata:function(){
    var that = this;
    wx.request({  //试用通知跳转后获取修改信息
      url: app.globalData.api,
      data: {
        opt: 'getTipsOpenid',
        openid: that.data.openid
      },
      success: function (res) {
        //console.log(res.data.ds)
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              id: res.data.ds[i].id,
              userName: res.data.ds[i].userName,
              phoneNum: res.data.ds[i].phoneNum,
              city: res.data.ds[i].city,
              province: res.data.ds[i].province,
              address: res.data.ds[i].address_Details
            })
          }

        }else{
          wx.showToast({
            title: '获取信息错误',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      }
    })
  },
  addressUpdate:function(){
    wx.navigateTo({
      url: '/pages/AddressModify/AddressModify?id=' + this.data.id,
    })
  },
  determine:function(){
    wx.navigateTo({
      url: '/pages/MyTrial/MyTrial',
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
    this.getdata();
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
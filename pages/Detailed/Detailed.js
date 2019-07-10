// pages/Detailed/Detailed.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clist: [],
    openid: '',
    isHide:false,
    isShow: false,
    mymyincome:0,//历史总收入
    mywithdraw:0,//历史总提现
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
    getApp().getUserTrajectory(5, 'onLoad', 'pages/Detailed_0', '进入收支明细页面');//获取用户轨迹
    that.setData({
      openid: wx.getStorageSync('openid')
    })
    //console.log(app.globalData.openid)
    that.getData();
  },
  //获取数据
  getData: function () {
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getDetailed',
        openid: that.data.openid
      },
      success: function (res) {
        //console.log(res)
        var list = that.data.clist;
        var myincome = 0;//总收入
        var withdraw = 0;//总提现
   
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            var dd = util.formatDate3(list[i]["createtime"]);


            if(list[i]["isplus"]== 0){
              myincome += list[i]["CashMoney"];
            } else if (list[i]["isplus"] == 1){
              withdraw += list[i]["CashMoney"]
            }
            


            
            // console.log(list[i]["CashMoney"])
            // console.log(res.data.ds[i]["isplus"])
            // var datetimes = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            list[i]["createtime"] = dd;
          }
          // console.log(res.data.ds)
          that.setData({
            clist: list,
            mymyincome: myincome,
            mywithdraw:withdraw
          });
        } else {
          wx.showToast({
            title: "暂无收支明细",
            icon: 'none'
          })
          that.setData({
            isHide: true,
            isShow:true
          });
        }

      }
    })
    wx.hideLoading();
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
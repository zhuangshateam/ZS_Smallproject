var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    userInfo: {},
    productList: [],     //审核数据
    ptList: [],          //我的产品数据
    toexamine: true,
    isApply:false,       //是否审核通过
    isProduct:true      //是否有发布的产品
  },
  /**
* 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    that.loadMore();
    that.myProduct();
  },
  loadMore: function () {
    var that = this;
    wx.request({  //品牌信息
      url: app.globalData.api,
      data: {
        opt: 'getproductList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        // console.log(res.data.ds);
        var list = that.data.productList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            // 日期转换
            var d = new Date(list[i]["CreateTime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["CreateTime"] = times;
            if (list[i]["Toexamine"] == 1) {
              that.setData({
                toexamine: false
              })
            }
            //console.log(list[i]["Toexamine"])
          }
          that.setData({
            productList: list,
            isApply:true
          });
        }
      }
    })
  },
  myProduct: function () {
    var that = this;
    wx.request({  //我的产品
      url: app.globalData.api,
      data: {
        opt: 'getMyproductList',
        openid: app.globalData.openid,
      },
      success: function (res) {
        console.log(res.data.ds);
        var list = that.data.ptList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
            // 日期转换
            var d = new Date(list[i]["CreateTime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["CreateTime"] = times;
            that.setData({
              isCont: res.data.ds.length
            })
          }
          that.setData({
            ptList: list,
            isProduct:false
          });
        }
      }
    })

  },
  toApply:function(){
    wx.navigateTo({
      url: '../partnersApply/partnersApply',
    })
  },
  toAddProducts:function(){
    wx.navigateTo({
      url: '../addProducts/addProducts',
    })
  },
  onPullDownRefresh() {

    setTimeout(() => {

      wx.stopPullDownRefresh(); //停止下拉元点

    }, 3000)

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
})
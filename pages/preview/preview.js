var util = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    picList: [], //图片数组--头部海报
    imgLists: [],//产品详情图片数组


    product_Name: '',
    trial_quantity: '',
    product_Specifications: '',
    retail_Price: '',
    main_functions: '',
    app_rules: '',
    details_introduce: '',

    imgarrList:[],
    imgarrList_detail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(options.id)
    // console.log(options.guid)
    this.setData({
      product_Name: options.title,
      trial_quantity: options.trial_quantity,
      product_Specifications: options.specifications,
      retail_Price: options.retail_Price,
      main_functions: options.main_functions,
      app_rules: options.app_rules,
      details_introduce: options.details_introduce,
      picList: options.uploadimgs,
      imgLists: options.detail_uploadimg
    })
    var inglist = this.data.picList.split(",");
    var imgarrList = this.data.imgarrList;
    for (var i = 0; i < inglist.length; i++) {
      imgarrList.push(inglist[i])
    }
    
    var inglist1 = this.data.imgLists.split(",");
    var imgarrList_detail = this.data.imgarrList_detail;
    for (var i = 0; i < inglist1.length; i++) {
      imgarrList_detail.push(inglist1[i])
    }
    that.setData({
      imgarrList: imgarrList,
      imgarrList_detail: imgarrList_detail
    })
    // const arr = [];
    // for (let path of inglist) {
    //   arr.push(path)
    // }
    //console.log(this.data.imgLists)
    // this.setData({
    //   picList: inglist,
    //   imgLists: inglist1
    // })
  },
  //预览图片
  previewImg: function (e) {
    var currentUrl = e.currentTarget.dataset.currenturl
    var previewUrls = e.currentTarget.dataset.previewurl
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: previewUrls, //必须是http图片，本地图片无效
    })
  },
  geReturn:function(){
    wx.navigateBack()  //返回上级页面
  },
   
  // getUserSubm: function () {
  //   var that = this
  //   that.setData({
  //     loading: true
  //   })
  //   //console.log(that.data.id)
  //   wx.navigateTo({
  //     url: '../Ontrial/Ontrial?id=' + that.data.id + '&copNum=' + that.data.copNumber,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
  //     success: function () {
  //       that.setData({
  //         loading: false
  //       })
  //     },        //成功后的回调；
  //     fail: function () { },          //失败后的回调；
  //     complete: function () { }      //结束后的回调(成功，失败都会执行)
  //   })
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
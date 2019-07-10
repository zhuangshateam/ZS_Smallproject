// pages/search/search.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    inputShowed: true,
    searchList:[],
    scrollTop: 0,      //滚动窗口
    scrollHeight: 0,    //滚动窗口高度
    len: 2,
    isLoading:true,
    serchNumber:0,
    isNull: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight,
        });
        if (res.windowHeight > 600) {
          that.setData({
            len: 2.2,
          });
        }
      }
    });
    //获取用户轨迹
    getApp().getUserTrajectory(1, 'onLoad', 'pages/search_0', '进入首页搜索');//获取用户轨迹
    that.setData({
      inputVal: options.inputVal,
    })
    that.hideInput()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    var that = this;
    //搜索数据
    if (this.data.inputVal == '') {
      wx.showToast({
        title: '请输入关键字',
        duration: 3000,
      })
    } else {
      that.setData({
        isLoading: true
      })
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getSearch',
          searchkey: this.data.inputVal
        },
        success: function (res) {
          console.log(res.data.status)
          if (res.data.status == 1) {
            wx.showToast({
              title: '暂无搜索结果',
              image: '/images/Tips.png',
              duration: 3000,
            })
            that.setData({
              isLoading: false
            })
          } else {
            var sList = that.data.searchList;
            for (var i = 0; i < res.data.ds.length; i++) {
              //console.log(res.data.ds[i]["imagesUrl"])
              sList.push(res.data.ds[i]);
            }
            console.log(that.data.searchList.length)
            for (var j = 0; j < that.data.searchList.length; j++) {
              var zan_mid = wx.getStorageSync('is_zan') || [];//获取全部点赞的mid
              for (let zan of zan_mid) {
                //console.log(that.data.makeupList[j].id)
                if (that.data.searchList[j].id === zan) {//遍历找到对应的id){
                  that.setData({
                    //[`makeupList[${j}].FabulousCount`]: that.data.makeupList[j].FabulousCount, //es6模板语法（反撇号字符）
                    [`searchList[${j}].FabulousImg`]: "/images/Fabulous_praise.png",
                  })
                }
              }
              var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid
              //console.log(res.data.ds[i].id)
              for (let hh of cookie_mid) {
                //console.log(that.data.newsList[0].id)
                if (that.data.searchList[j].id === hh) {//遍历找到对应的id){
                  that.setData({
                    [`searchList[${j}].FabulousImg`]: "/images/Fabulous_praise.png",
                  })
                }
              }
            }
            that.setData({
              searchList: res.data.ds,
              isLoading: false,
              serchNumber: res.data.ds.length
            })
          }

        }
      })
    }
  },
  //清除输入框数据
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchList: [],
      isNull: false,
      serchNumber: 0
    })
  },
  inputTyping: function (e) {

    //搜索数据
    if (e.detail.value == '') {
      this.setData({
        searchList: [],
        isNull: false,
        serchNumber: 0,
      });
    } else {
      this.setData({
        inputVal: e.detail.value,
        isNull: true
      })
      //this.search(e.detail.value)
    }
  },
  searchBtn: function () {
    this.hideInput()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点赞处理函数（xx.js文件）
  zan: function (item_id) {
    var that = this;
    var show;//传递到数据库点赞的状态      
    var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid  
    console.log(cookie_mid)
    var newmessage = [];
    for (var i = 0; i < that.data.searchList.length; i++) {
      if (that.data.searchList[i].id == item_id) {//遍历找到对应的id
        var num = that.data.searchList[i].FabulousCount;//当前赞数
        var isshow; //点赞的状态
        if (cookie_mid.includes(item_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < cookie_mid.length; j++) {
            if (cookie_mid[j] == item_id) {
              cookie_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`searchList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`searchList[${i}].FabulousImg`]: "/images/Fabulous.png",
          })
          wx.setStorageSync('zan', cookie_mid);
          wx.showToast({
            title: "取消点赞!",
            icon: 'none'
          })
          //console.log("前端取消点赞"+isshow)

        } else {
          isshow = 1;//点赞的状态
          ++num;
          that.setData({
            [`searchList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            [`searchList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          cookie_mid.unshift(item_id);//新增赞的mid
          wx.setStorageSync('zan', cookie_mid);
          wx.showToast({
            title: "点赞成功!",
            icon: 'none'
          })
          //console.log("前端点赞成功" + isshow)
        }
        //console.log(cookie_mid); 
        //点赞数据同步到数据库
        wx.request({
          url: app.globalData.api,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            opt: 'zannum',
            newsid: item_id,
            show: isshow,
            openid: app.globalData.openid,
          },
          success: function (res) {
            //console.info(res.data.ds);
            if (res.data.status == 0) {
              that.setData({
                isLikeimg: '/images/Fabulous_praise.png'
              });
            }
          }
        })
      }
    }
  },
  /**
 * 点赞
 */
  favorclick: function (options) {
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id
    console.log(item_id);//列表id
    this.zan(item_id);
  },
  update_zan: function (options) {
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id
    console.log(item_id);//列表id
    this.is_zan(item_id);
  },
  // BA作文列表点赞
  //点赞
  is_zan: function (item_id) {
    var that = this;
    var show;//传递到数据库点赞的状态      
    var zan_mid = wx.getStorageSync('is_zan') || []; //获取全部点赞的mid      
    var newmessage = [];
    for (var i = 0; i < that.data.searchList.length; i++) {
      if (that.data.searchList[i].id == item_id) {//遍历找到对应的id
        var num = that.data.searchList[i].FabulousCount;//当前赞数
        var zan_isshow; //点赞的状态
        if (zan_mid.includes(item_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < zan_mid.length; j++) {
            if (zan_mid[j] == item_id) {
              zan_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          zan_isshow = 0;//点赞的状态
          that.setData({
            [`searchList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`searchList[${i}].FabulousImg`]: "/images/Fabulous.png",
          })
          wx.setStorageSync('is_zan', zan_mid);
          wx.showToast({
            title: "取消点赞!",
            icon: 'none'
          })
          //console.log("前端取消点赞"+isshow)

        } else {
          zan_isshow = 1;//点赞的状态
          ++num;
          that.setData({
            [`searchList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            [`searchList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          zan_mid.unshift(item_id);//新增赞的mid
          wx.setStorageSync('is_zan', zan_mid);
          wx.showToast({
            title: "点赞成功!",
            icon: 'none'
          })
          //console.log("前端点赞成功" + isshow)
        }
        //console.log(cookie_mid); 
        //点赞数据同步到数据库
        wx.request({
          url: app.globalData.api,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            opt: 'getUpdateZan',
            newsid: item_id,
            isshow: zan_isshow,
            openid: app.globalData.openid,
          },
          success: function (res) {
            //console.info(res.data.ds);
            if (res.data.status == 0) {
              that.setData({
                ismakeupimg: '/images/Fabulous_praise.png'
              });
            }
          }
        })
      }
    }
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
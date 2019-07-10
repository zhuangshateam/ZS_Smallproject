var yangdate = require("../../utils/sign.js");
var utils=require("../../utils/util.js")
const app = getApp()
// pages/sign_in/sign_in.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    signDay: [{ "signDay": "9" }, { "signDay": "11" }, { "signDay": "12" }, { "signDay": "15" }],
    signs: [1, 2, 3, 5, 6, 7],
    signtype: "1",  //1为未签到，2为已签到
    signDays: [],  //已签到天数
    signseriesDay:[],
    todayDate: "1",  //天数
    todayMonth: "",   //月份
    todayYear: "",    //年份
    nextMonth: "",    //下个月份
    nextYear: "",     //下一年
    prevYear: "",   //前一年
    prevMonth: "",    //前一月
    seriesCount: "0",  //已连续签到多少天
    series_gos: "20",  //再连续签到多少天
    for_signs: "none",
    powerData: "0",
    date:'',
    showModal: false,
    buttonClicked: true
  },
  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false,
      for_signs: "block"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/mySign_0', '进入签到页面');//获取用户轨迹
    var DATE = utils.formatTime(new Date());

    this.setData({

      date: DATE,
      openid: wx.getStorageSync('openid')
    });
    var getToday = new Date();
    var todayDate = getToday.getDate();
    var todayMonths = getToday.getMonth();
    var todayMonth = (todayMonths + 1);
    var todayYear = getToday.getFullYear();
    var todayss = getToday.getDate();
    if (todayMonth < 10) {
      var todayMonthss = "0" + todayMonth;
    } else {
      var todayMonthss = todayMonth;
    }
    //console.log(todayss);
    var godates = todayYear + "-" + todayMonthss + "-01";
    //console.log("666"+godates)
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: "getSign",
        date: godates,
        openid: that.data.openid,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        //console.log(res.data.status)
        if (res.data.status == 0) {
         // var $datas = res.data.ds;//从服务器获取签到数据数组(1,2,3)
          var signDate_arr = new Array();
          for (var i = 0; i < res.data.ds.length; i++) {
            signDate_arr.push(res.data.ds[i]["todayss"]);
          }
          //console.log(signarr.length)
          var count_signday = res.data.ds.length;
          //console.log(count_signday)
          if (count_signday >= 20) {
            var series_gos = "21";
          } else if (count_signday < 0) {
            var series_gos = 20;
          } else {
            var series_gos = 20 - parseInt(count_signday);
          }
          that.setData({
            seriesCount: count_signday,
            series_gos: series_gos,
            signDays: signDate_arr
          });
          if (signDate_arr.indexOf(todayss) > -1) {
            console.log("当前已签到");
            that.setData({
              signtype: "2",
            });
          } else {
            console.log("当前未签到");
            that.setData({
              signtype: "1",
            });
          }
          //console.log(signDate_arr[0]);
          yangdate.yang_date.bulidCal(todayYear, todayMonth, that, signDate_arr);//初始化加载日历
        } else {
          // wx.showToast({
          //   title: '网络不通畅',
          //   icon: 'loading',
          //   duration: 1500
          // });
          var signDate_arr = new Array();
          yangdate.yang_date.bulidCal(todayYear, todayMonth, that, signDate_arr);//初始化加载日历
        }
      }, error: function () {
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 1500
        });
      }
    });
    this.setData({
      todayDate: todayDate,
      todayMonth: todayMonth,
      todayYear: todayYear,
      prevYear: todayYear,
      nextYear: todayYear,
      prevMonth: todayMonth,
      nextMonth: todayMonth,
      showYear: todayYear,
      showMonth: todayMonth,
    });
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading();
      that.setData({
        buttonClicked: false
      });
    }, 800) //延迟时间 这里是1秒
  },
  sign_start: function () {
    var that = this;
    var powerData = 5;
    var getToday = new Date();
    var todayss = getToday.getDate();
    wx.request({
      url: app.globalData.api,
      data: {
        opt: "getSignAdd",
        openid: that.data.openid,
        datetime: this.data.date,
        todayss: todayss
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        //console.log(res.data.status)
        if (res.data.status==0){
          //每次签到成功后积分加5
          wx.request({
            url: app.globalData.api,
            data: {
              opt: "setUpdateIntegral",
              openid: that.data.openid,
              powerData: powerData,
            },
            success: function (res) {
              //console.log(res.data)
              wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 1500
              });
              var getToday = new Date();
              var todayDate = getToday.getDate();
              var todayMonths = getToday.getMonth();
              var todayMonth = (todayMonths + 1);
              var todayYear = getToday.getFullYear();
              var todayss = getToday.getDate();
              if (todayMonth < 10) {
                var todayMonthss = "0" + todayMonth;
              } else {
                var todayMonthss = todayMonth;
              }
              //console.log(todayss);
              var godates = todayYear + "-" + todayMonthss + "-01";
              wx.request({
                url: app.globalData.api,
                data: {
                  opt: "getSign",
                  date: godates,
                  openid: that.data.openid,
                },
                success: function (result) {
                  if (result.data.status == 0) {
                    var signLenht = result.data.ds.length;
                    if (parseInt(signLenht)==20){
                        that.qiandao();
                        that.setData({
                        showModal: true
                      })
                    }
                  }
                
                }
              })
            }
          })
          that.setData({
            // for_signs: "block",
            signtype: "2",
            powerData: powerData,
          });
        }else{
          wx.showToast({
            title: '签到失败',
            icon: 'success',
            duration: 1500
          });
        }
        

      }
    })


    this.onLoad();
    //签到成功后重新调用后台接口加载新的签到数据
  },
  qiandao:function(){
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: "getSignqiandao",
        openid: that.data.openid
      },
      success: function (result) {
        //console.log(result.data)
        // if (result.data.status == 0) {
        //   var signLenht = result.data.ds.length;
        //   if (parseInt(signLenht) == 5) {
        //       that.setData({
        //         showModal: true
        //       })
        //   }
        // }

      }
    })
  },
  close_qdbox: function () {
    var seriesCount = this.data.seriesCount;
    // var seriesCount = seriesCount+1;
    if (seriesCount < 10) {
      var series_gos = 10 - seriesCount;
    } else {
      var series_gos = "0";
    }
    this.setData({
      seriesCount: seriesCount,
      series_gos: series_gos,
      for_signs: "none",
    });
  },
  sign_end: function () {
    wx.showToast({
      title: '今日已经签到',
      icon: 'loading',
      duration: 1500
    });
  },
  sign_prev: function () {
    console.log("上一月");
    var showMonth = this.data.showMonth;
    //console.log(showMonth)
    var todayMonth = this.data.todayMonth;
    if (showMonth == "1") {
      var showMonth = "12";
      var showYear = parseInt(this.data.showYear) - 1;
    } else {
      var showMonth = parseInt(this.data.showMonth) - 1;
      var showYear = this.data.showYear;
    }
    console.log(showMonth)
    if (parseInt(todayMonth - 3) == showMonth) {
      wx.showToast({
        title: '不能查看更多了',
        icon: 'loading',
        duration: 1500
      });
      return;
    }
    var that = this;
    if (showMonth < 10) {
      var showMonths = "0" + showMonth;
    } else if (showMonth == todayMonth) {
      var showMonths = todayMonth;
    }else {
      var showMonths = showMonth;
    }
    var godates = showYear + "-" + showMonths + "-01";
    //获取上一月最后一天
    var monthDaySize;
    if (showMonth == 1 || showMonth == 3 || showMonth == 5 || showMonth == 7 || showMonth == 8 || showMonth == 10 || showMonth == 12) {
      monthDaySize = 31;
    } else if (showMonth == 4 || showMonth == 6 || showMonth == 9 || showMonth == 11) {
      monthDaySize = 30;
    } else if (showMonth == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    var updates = showYear + "-" + showMonths +"-"+ monthDaySize;
    
    //console.log(godates)
    wx.request({
      url: app.globalData.api,
      data: {
        opt: "getupperSign",
        date: godates,
        openid: app.globalData.openid,
        updates: updates
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        if (res.data.status == 0) {
          //console.log(res.data);
          var signDate_arr = new Array();
          for (var i = 0; i < res.data.ds.length; i++) {
            signDate_arr.push(res.data.ds[i]["todayss"]);
          }
          that.setData({
            signDays: signDate_arr
          });
          //引入日历默认
          yangdate.yang_date.bulidCal(showYear, showMonth, that, signDate_arr);
          //初始化加载日历
        } else {
          // wx.showToast({
          //   title: '网络不通畅',
          //   icon: 'loading',
          //   duration: 1500
          // });
          var signDate_arr = new Array();
          yangdate.yang_date.bulidCal(showYear, showMonth, that, signDate_arr);
        }
      }, error: function () {
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 1500
        });
      }
    });
    this.setData({
      showYear: showYear,
      showMonth: showMonth,
    });
  },
  sign_next: function () {
    console.log("下一月");
    var showMonth = this.data.showMonth;
    var todayMonth = this.data.todayMonth;
    if (todayMonth == showMonth) {
      wx.showToast({
        title: '未签到不能查看',
        icon: 'loading',
        duration: 1500
      });
      return;
    }
    if (showMonth == "12") {
      var showMonth = "1";
      var showYear = parseInt(this.data.showYear) + 1;
    } else {
      var showMonth = parseInt(this.data.showMonth) + 1;
      var showYear = this.data.showYear;
    }


    var that = this;

    if (showMonth < 10) {
      var showMonths = "0" + showMonth;
    } else if (showMonth == todayMonth){
      var showMonths = todayMonth;
    }else{
      var showMonths = showMonth;
    }
    var godates = showYear + "-" + showMonths + "-01";
    //获取上一月最后一天
    var monthDaySize;
    if (showMonth == 1 || showMonth == 3 || showMonth == 5 || showMonth == 7 || showMonth == 8 || showMonth == 10 || showMonth == 12) {
      monthDaySize = 31;
    } else if (showMonth == 4 || showMonth == 6 || showMonth == 9 || showMonth == 11) {
      monthDaySize = 30;
    } else if (showMonth == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };
    var updates = showYear + "-" + showMonths + "-" + monthDaySize;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: "getupperSign",
        date: godates,
        openid: app.globalData.openid,
        updates: updates
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == 0) {
          console.log(res.data.ds); 
          var signDate_arr = new Array();
          for (var i = 0; i < res.data.ds.length; i++) {
            signDate_arr.push(res.data.ds[i]["todayss"]);
          }
          that.setData({
            signDays: signDate_arr
          });
          console.log(signDate_arr[0]);
          yangdate.yang_date.bulidCal(showYear, showMonth, that, signDate_arr);
          //初始化加载日历
        } else {
          var signDate_arr = new Array();
          yangdate.yang_date.bulidCal(showYear, showMonth, that, signDate_arr);
        }
      }, error: function () {
        wx.showToast({
          title: '服务器错误',
          icon: 'loading',
          duration: 1500
        });
      }
    });
    this.setData({
      showYear: showYear,
      showMonth: showMonth,
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
//index.js
var util = require("../../utils/util.js")
const base = require('../../utils/baseEncode.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    tabbar: {},
    currentTab: 0,                    //tab切换值   0为日记，1为作文
    linkUrl: app.globalData.imgUrl,  //图片API地址
    newsList: [],     //BA日记
    makeupList:[],    //美妆点评
    mousList:[],      //匿名区
    commList:[],    //首页评论列表（加载两条）
    // hidden: true,       //是否隐藏
    //ishidden: true,//加载弹框显示
    scrollTop: 0,      //滚动窗口
    scrollHeight: 0,    //滚动窗口高度
    isShow: true,     //是否显示
    page: 1,        //当前页
    pageSize: 6,    //页数
    isAjax: true,   //是否启用AJAX
    //isGet: true,    //是否GET传值
    star: 0,      //评分
    isLoading: true,//是否显示加载数据提示
    len:2,
    inputVal:'',
    inputShowed:false,
    searchKey:'',   //搜索关键字
    titleName: '',   //转发标题
    imgesUrl: ''  ,  //转发图片

    height: 0, // scroll-wrap 的高度，这个高度是固定的
    inner_height: 0, // inner-wrap 的高度，这个高度是动态的
    scroll_top: 0, // 滚动到位置。
    start_scroll: 0, // 滚动前的位置。
    touch_down: 0, // 触摸时候的 Y 的位置

    official:false,//官方标志
    openid: '',
    issue_idList:[],
    scrollH: 0,
    imgWidth: 0,
    imgHeight:0,
    openid_ssid:'',
    loadingtime:'',
    instructions:0, //引导按钮是否显示
    /***弹出层 */
    //showModal: false

    // 匿名区点赞/
    //isselect:false,
    anonymousList:[], //点赞列表
    imageUrl:'http://www.izhuangsha.com/api/',
    opid:null,        //邀请好友参数                                              
    isNewUser: false,   //弹出层
    isShowNews: false, //新人按钮是否显示
    userInfo: '',
    add_desk_top: "",
  },
  // 禁止屏幕滚动
  // preventTouchMove: function () {
  // },

  // 弹出层里面的弹窗
  // ok: function () {
  //   this.setData({
  //     showModal: false
  //   })
  // },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.editTabbar();
    app.onShow();
    //opType = '操作类型', opEvent = '操作事件',opEventId = '操作事件ID',opnEventDetail = '操作事件详情'
    that.setData({
      openid: wx.getStorageSync('openId'),
      userInfo: app.globalData.userInfo,
    })
    if (options.opid!=null){
      that.setData({
        opid: options.opid
      })
    }
    app.getOpenid().then(function (res) {

      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      }
      var scene = decodeURIComponent(options.scene)
      if (scene != 'undefined') {
        that.setData({
          opid: scene
        })
        getApp().getUserTrajectory(1, 'onLoad', 'pages/index_1', '新用户进入小程序首页');//获取用户轨迹
        var uId = wx.getStorageSync('openid');
        // console.log("二维码进入Openid:" + uId)
        // console.log("opid:" + that.data.opid)
        wx.request({  //查询当前用户是否完成任务
          url: app.globalData.api,
          data: {
            opt: 'getSelectIsNewUsers_Rewrite',  //selectNewUser  查询当前用户是否是新用户
            openid: uId
          },
          success: function (res) {
            //console.log("shifixinyonghu:" + res.data)
            if (res.data < 1) {
              //保存当前新用户信息
              wx.request({
                url: 'https://www.izhuangsha.com/api/weixin/index.aspx',
                data: {
                  opt: 'getWxNewsUserInfo_Qrcode',
                  openid: uId,
                  opid: scene

                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (result) {
                  setTimeout(function () {
                    that.setData({//新用户弹出遮罩层
                      isNewUser: true
                    })
                  }, 500) //延迟时间 这里是1秒
                }
              })
            }
          }
        })
      }
      if (options.opid != undefined) {
        that.setData({
          opid: options.opid
        })
        //获取用户轨迹
        getApp().getUserTrajectory(1, 'onLoad', 'pages/index_1', '新用户进入小程序首页');//获取用户轨迹
        var uId = wx.getStorageSync('openid');
        // console.log("uid:" + uId)
        // console.log("asdsad:" + that.data.opid)
        wx.request({  //查询当前用户是否完成任务
          url: app.globalData.api,
          data: {
            opt: 'getSelectIsNewUsers_Rewrite',
            openid: uId
          },
          success: function (res) {
            //console.log("shifixinyonghu:" + res.data)
            if (res.data < 1) {
              //保存当前新用户信息
              wx.request({
                url: 'https://www.izhuangsha.com/api/weixin/index.aspx',
                data: {
                  opt: 'getWxNewsUserInfo',
                  openid: uId,
                  opid: options.opid

                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (result) {
                  console.log(result)
                  setTimeout(function () {
                    that.setData({//新用户弹出遮罩层
                      isNewUser: true
                    })
                  }, 500) //延迟时间 这里是1秒
                }
              })
            }
          }
        })
      }

    });
    getApp().getUserTrajectory(1, 'onLoad', 'pages/index_0', '进入小程序首页');//获取用户轨迹
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        let barHeight = res.statusBarHeight;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          scrollHeight: res.windowHeight,
          add_desk_top: barHeight + 46 + "px"
        });
        if (res.windowHeight < 600) {
          that.setData({
            len: 1.88,
          });
        }
        if (res.windowHeight > 600) {
          that.setData({
            len: 1.94,
          });
        }
        if (res.windowHeight > 700) {
          that.setData({
            len:2.43,
          });
        }
    
        //加载首组图片
        //this.getdata();
      }
    })
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
              app.globalData.userInfo= res.userInfo
          }
        })
      }
    });
    wx.request({  //转发
      url: app.globalData.api,
      data: {
        opt: 'getForwardImg'
      },
      success: function (res) {
        that.setData({
          titleName: res.data.ds[0].titleNmae,
          imgesUrl: res.data.ds[0].imgUrl
        })
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误!",
          icon: 'none'
        })
      },//请求失败
    })
    that.getdata();
    that.getMoredata();
    that.getMousData();
  },
  contactBind:function(){
    wx.showToast({
      title: "此功能暂未开放!",
      icon: 'none'
    })
  },
  tabNav: function (e) {
    var that = this;
  
    if (that.data.currentTab == e.target.dataset.current) {
      return false;
    }
    if (e.target.dataset.current == 0) {
      that.setData({
        currentTab: e.target.dataset.current
      }) 
    } else if (e.target.dataset.current == 1) {
      that.setData({
        currentTab: e.target.dataset.current
      })

    } else if (e.target.dataset.current == 2) {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
     
  },
  //点赞处理函数（xx.js文件）
  zan: function (item_id) {
    var that = this;
    //var show;//传递到数据库点赞的状态      
    var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid  
    var isshow=1; //点赞的状态 
    var newmessage = [];
    for (var i = 0; i < that.data.newsList.length; i++) {
      if (that.data.newsList[i].id == item_id) {//遍历找到对应的id
        var num = that.data.newsList[i].FabulousCount;//当前赞数
        
        if (cookie_mid.includes(item_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < cookie_mid.length; j++) {
            if (cookie_mid[j] == item_id) {
              cookie_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`newsList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`newsList[${i}].FabulousImg`]: "/images/Fabulous.png",
          })
          
          wx.setStorageSync('zan', cookie_mid);
          // wx.showToast({
          //   title: "取消点赞!",
          //   icon: 'none',
          //   duration: 2000,
          //   mask: true
          // })

        } else {
          //isshow = 1;//点赞的状态
          ++num;
          that.setData({
            [`newsList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            [`newsList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          cookie_mid.unshift(item_id);//新增赞的mid
          wx.setStorageSync('zan', cookie_mid);
          // wx.showToast({
          //   title: "点赞成功!",
          //   icon: 'none',
          //   duration: 2000,
          //   mask: true
          // })
        }
        //点赞数据同步到数据库
        wx.request({
          url: app.globalData.api,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            opt:'zannum',
            newsid: item_id,
            show: isshow,
            openid: this.data.openid,
          },
          success: function (res) {
            if (res.data.status == 0) {
              // that.setData({
              //   isLikeimg: '/images/Fabulous_praise.png'
              // });
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
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id -经验
    this.zan(item_id);
  },
  update_zan:function(options){
    var makeup_id = options.currentTarget.dataset.id;//此处找到列表的id--体验
    this.is_zan(makeup_id);
  },
  clickFabulous: function (options){
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id -经验
    this.isclickFabulous(item_id);
    
  },
  // BA作文列表点赞
  //点赞
  is_zan: function (makeup_id) {
    var that = this;
    //var show;//传递到数据库点赞的状态      
    var zan_mid = wx.getStorageSync('is_zan') || [];//获取全部点赞的mid  
    //console.log(zan_mid)
    var isshow = 1; //点赞的状态 
    var newmessage = [];
    for (var i = 0; i < that.data.makeupList.length; i++) {
      if (that.data.makeupList[i].id == makeup_id) {//遍历找到对应的id
        var num = that.data.makeupList[i].FabulousCount;//当前赞数

        if (zan_mid.includes(makeup_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < zan_mid.length; j++) {
            if (zan_mid[j] == makeup_id) {
              zan_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`makeupList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`makeupList[${i}].FabulousImg`]: "/images/Fabulous.png",
            //isselect:true
          })

          wx.setStorageSync('is_zan', zan_mid);
          // wx.showToast({
          //   title: "取消点赞!",
          //   icon: 'none'
          // })

        } else {
          //isshow = 1;//点赞的状态
          ++num;
          that.setData({
            [`makeupList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            [`makeupList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",

            // [`col1[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            // [`col1[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          zan_mid.unshift(makeup_id);//新增赞的mid
          wx.setStorageSync('is_zan', zan_mid);
          // wx.showToast({
          //   title: "点赞成功!",
          //   icon: 'none'
          // })
        }
        //console.log(zan_mid); 
        //点赞数据同步到数据库
        wx.request({
          url: app.globalData.api,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            opt: 'getUpdateZan',
            newsid: makeup_id,
            isshow: isshow,
            openid: this.data.openid,
          },
          success: function (res) {
            //console.info(res.data.ds);
            if (res.data.status == 0) {
              // that.setData({
              //   isLikeimg: '/images/Fabulous_praise.png'
              // });
            }
          }
        })
      }
    }
  },
  //点赞--匿名区
  isclickFabulous: function (item_id) {
    var that = this;

    //var show;//传递到数据库点赞的状态      
    var zan_niming = wx.getStorageSync('niming_zan') || [];//获取全部点赞的mid  
    
    var isshow_select = 1; //点赞的状态 
    var newmessage = [];
    for (var i = 0; i < that.data.mousList.length; i++) {
      if (that.data.mousList[i].id == item_id) {//遍历找到对应的id
        var num = that.data.mousList[i].FabulousCount;//当前赞数
        if (zan_niming.includes(item_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < zan_niming.length; j++) {
            if (zan_niming[j] == item_id) {
              zan_niming.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow_select = 0;//点赞的状态
          //console.log([`mousList[${i}].Fabulousimg`])
          that.setData({
            [`mousList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`mousList[${i}].FabulousImg`]: "/images/Fabulous.png",
            //isselect: 1
          })
          wx.setStorageSync('niming_zan', zan_niming);
        } else {
          isshow_select = 1;//点赞的状态
          ++num;
          //console.log(num)
          that.setData({
            [`mousList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            //isselect: true,
            [`mousList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          zan_niming.unshift(item_id);//新增赞的mid
          wx.setStorageSync('niming_zan', zan_niming);
          // wx.showToast({
          //   title: "点赞成功!",
          //   icon: 'none'
          // })
        }
        //点赞数据同步到数据库
        wx.request({
          url: app.globalData.api,
          method: 'POST',
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            opt: 'getNimingquZan',
            newsid: item_id,
            isshow: isshow_select,
            openid: that.data.openid,
          },
          success: function (res) {
            // var message = that.data.mousList;
            // for (var i in message) {
            //   if (message[i].id == item_id) {
            //     if (isshow_select) {
            //       message[i].FabulousNum = parseInt(message[i].FabulousNum) + 1
            //     } else {
            //       message[i].FabulousNum = parseInt(message[i].FabulousNum) - 1
            //     }

            //   }
            // }
            // that.setData({
            //   message: message
            // })
          }
        })
      }
    }
  },
  catchTapCategory: function (e) {
    var that = this;
    var nid = e.currentTarget.dataset.nid;
    //跳转商品详情
    wx.navigateTo({ url: '../makeupInfo/makeupInfo?id=' + nid})
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    that.setData({
        isLoading: true
      })
    if (that.data.inputVal==''){
        wx.showLoading({
          title: '玩命加载中',
          mask:true
        })
      that.setData({
        page: that.data.page+1
        })
      that.getdata();
    }else{
      that.setData({
          isLoading: false
        })
    }
  },
  //页面滑动到底部
  bindDownLoad_tiyan: function () {
    var that = this;
    that.setData({
      isLoading: true
    })
    if (that.data.inputVal == '') {
      wx.showLoading({
        title: '玩命加载中',
        mask: true
      })
      that.setData({
        page: that.data.page + 1
      })
      that.getMoredata();
    } else {
      that.setData({
        isLoading: false
      })
    }
  },
  //获取经验
  getdata:function(){
    var that = this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getArticle',
        currentTabId: 0,
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        var list = that.data.newsList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            res.data.ds[i]["Reviewcontent"] = util.trim(res.data.ds[i]["Reviewcontent"], "g")
            list.push(res.data.ds[i]);

          }
          for (var j = 0; j < that.data.newsList.length; j++) {
            var cookie_mid = wx.getStorageSync('zan') || [];//获取全部点赞的mid
            for (let hh of cookie_mid) {
              if (that.data.newsList[j].id === hh) {//遍历找到对应的id){
                that.setData({
                  [`newsList[${j}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
          }
          that.setData({
            newsList: list,
          });
          if (res.data.ds.length < 6) {
            that.setData({
              isLoading: false
            })
          }
        }
        else {
          that.setData({
            isLoading: false,
          });
        }
      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })
      },//请求失败
    })
    // setTimeout(function () {
    //   //要延时执行的代码
    //   wx.hideLoading()
    // }, 2000) //延迟时间 这里是1秒
  },
  //获取体验
  getMoredata:function(){
    var that = this;
      this.setData({
        loadingtime: setInterval(function () {
          isLoading: true
        }, 300)
      })

      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getArticle',
          currentTabId: 1,
          page: that.data.page,
          pageSize: that.data.pageSize
        },
        success: function (res) {
          var list1 = that.data.makeupList;
          if (res.data.status == 0) {
            // wx.setStorage({
            //   key: 'makepList',
            //   data: res.data.ds,
            // })
            for (var i = 0; i < res.data.ds.length; i++) {
              list1.push(res.data.ds[i]);
            }
            for (var j = 0; j < that.data.makeupList.length; j++) {
              var zan_mid = wx.getStorageSync('is_zan') || [];//获取全部点赞的mid
              for (let zan of zan_mid) {
                if (that.data.makeupList[j].id === zan) {//遍历找到对应的id){
                  that.setData({
                    //[`makeupList[${j}].FabulousCount`]: that.data.makeupList[j].FabulousCount, //es6模板语法（反撇号字符）
                    [`makeupList[${j}].FabulousImg`]: "/images/Fabulous_praise.png",
                  })
                }
              }
            }
            that.setData({
              makeupList: list1,
            });
            if (res.data.ds.length < 6) {
              that.setData({
                isLoading: false,
              })
            }
          }
          else {
            that.setData({
              isLoading: false,
            });
          }
        }, fail: function (err) {
          wx.showToast({
            title: '网络错误',
            duration: 2000,
            mask: true
          })
        },//请求失败
      })
    loadingtime: setInterval(function () {
      wx.hideLoading();
    }, 2000)
  },
  //获取匿名区
  getMousData: function () {
    var that = this;
    this.setData({
      loadingtime: setInterval(function () {
        isLoading: true
      }, 300)
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getAnonymousList',
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        var mlist = that.data.mousList;
        if (res.data.status != 1) {
          for (var i = 0; i < res.data.length; i++) {
            mlist.push(res.data[i]);
            // 日期转换
            let d = new Date(res.data[i]["anonymous_time"]).getTime();
            var times = util.timeHandle(d);
            //console.log(times)
            res.data[i]["anonymous_time"] = times;
            //将评论解码
            //console.log(res.data[i]["reply_msg"])
            //mlist[i]["reply_msg"] = base.baseDecode(mlist[i]["reply_msg"]);
            //评论列表
            var cList = that.data.commList;
            for (var j = 0; j < res.data[i].anony.length; j++) {
              res.data[i].anony[j]["reply_msg"] = base.baseDecode(res.data[i].anony[j]["reply_msg"]);
              cList.push(res.data[i].anony[j])
            }
            that.setData({
              commList: cList
            })
          }
          for (var y = 0; y < that.data.mousList.length; y++) {
            var zan_mid = wx.getStorageSync('niming_zan') || [];//获取全部点赞的mid
            for (let zan1 of zan_mid) {
              if (that.data.mousList[y].id === zan1) {//遍历找到对应的id){
                that.setData({
                  [`mousList[${y}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
           
          }
          that.setData({
            mousList: mlist,
          });
          if (res.data.length < 6) {
            that.setData({
              isLoading: false,
            })
          }
        }
        else {
          that.setData({
            isLoading: false,
          });
        }
      }, fail: function (err) {
        wx.showToast({
          title: '网络错误',
          duration: 2000,
          mask: true
        })
      },//请求失败
    })
    loadingtime: setInterval(function () {
      wx.hideLoading();
    }, 2000)
  },
  //页面滑动到底部
  bindDownLoad3: function () {
    var that = this;
    that.setData({
      isLoading: true
    })
    if (that.data.inputVal == '') {
      wx.showLoading({
        title: '玩命加载中',
        mask: true
      })
      that.setData({
        page: that.data.page + 1
      })
      that.getMousData();
    } else {
      that.setData({
        isLoading: false
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    var that = this;
    if (this.data.inputVal == '') {
      
      this.getdata();
    }else{
    //搜索数据
      wx.navigateTo({
        url: '../search/search?inputVal=' + this.data.inputVal,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
             success: function() { },        //成功后的回调；
            fail:function() { },          //失败后的回调；
          complete:function() { }      //结束后的回调(成功，失败都会执行)
      })
    }
    this.setData({
      inputShowed: false,
      inputVal: ""
    });
    // this.getdata();
  },
  searchBtn: function () {
    this.hideInput()    
  },
  //清除输入框数据
  clearInput: function () {
    this.setData({
      inputVal: ""
    })
  },
  inputTyping: function (e) {

    //搜索数据
    if (e.detail.value==''){
      this.setData({
        newsList: [],
        makeupList: [],
        page: 1
      });
      this.getdata();
    }else{
      this.setData({
        inputVal: e.detail.value
      })
      //this.search(e.detail.value)
    }
  },
  bindChange: function (e) {
    var that = this;
    var that = this;
    if (e.detail.current == 0) {
      this.setData({
        currentTab: e.detail.current,
      })
      // that.getdata();
      return false;
    } 
    else {
      this.setData({
        currentTab: e.detail.current
      })
    }
    that.setData({ currentTab: e.detail.current });

  },
  topage: function () {
    wx.navigateTo({
      url: `/pages/help/help`
    })
  },
  // 点击评论按钮
  // comment_focus: function (options){
  //   var nid = options.currentTarget.dataset.nid;//此处找到列表的id
  //   var istrue=true;
  //   wx.navigateTo({
  //     url: "/pages/newsinfo/newsinfo?id=" + nid + " & currentTab=0&istrue="+istrue
  //   });
  // },
  //关闭引导
  // close_add_desk: function () {
  //   let that = this;
  //   that.setData({
  //     add_desk_isshow: false,
  //     isNewUser:true
  //   })
  // },
  onShow: function (ret) {
    var that = this;
    wx.request({  //引导按钮是否显示
      url: app.globalData.api,
      data: {
        opt: 'getInstructions'
      },
      success: function (res) {
        that.setData({
          instructions: res.data
          //   titleName: res.data.ds[0].titleNmae,
          //   imgesUrl: res.data.ds[0].imgUrl
        })
      }
    })
    // var pages = getCurrentPages() //获取加载的页面
    // console.log("pages:" + pages)
    // var currentPage = pages[pages.length - 1] //获取当前页面的对象
    // console.log("currentPage:" + currentPage)
    // var url = currentPage.route //当前页面url
    // console.log("url:" + url)
    // var options = currentPage.options.opid //如果要获取url中所带的参数可以查看options
    // console.log("options:" + currentPage.options.opid)
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          //console.log("wei")
          wx.redirectTo({
            url: '../login/login?url=index&opid=' + that.data.opid,
          })
        }else{
         
          // if (that.data.opid != null)
          // {
            //console.log("opid:" + that.data.opid)
            app.getOpenid().then(function (res) {
              var openid = wx.getStorageSync('openid');
              if(openid==""||openid==null){
                openid = wx.getStorageSync('openId');
              }
              wx.request({  //查询当前新用户是否已完成新人任务--通过审核后,隐藏"新人专享"按钮
                url: app.globalData.api,
                data: {
                  opt: 'getSelectIsNewUsers_RewriteInfo',
                  openid: that.data.openid
                },
                success: function (res) {
                  if (res.data == 0) {
                    that.setData({//新用户显示"新人专享"按钮
                      isShowNews: true
                    })
                  } else {
                    that.setData({//新用户隐藏"新人专享"按钮
                      isShowNews: false
                    })
                  }

                }
              })

            });

          // }else{
          //   wx.request({  //查询当前新用户是否已完成新人任务--通过审核后,隐藏"新人专享"按钮
          //     url: app.globalData.api,
          //     data: {
          //       opt: 'getSelectIsNewUsers_RewriteInfo',
          //       openid: that.data.openid
          //     },
          //     success: function (res) {
          //       if (res.data == 0) {
          //         that.setData({//新用户显示"新人专享"按钮
          //           isShowNews: true
          //         })
          //       } else {
          //         that.setData({//新用户隐藏"新人专享"按钮
          //           isShowNews: false
          //         })
          //       }

          //     }
          //   })
          // }

        }
      }
    })
    

  },
  // getNewsUsers:function(){
  //   var that=this;
  //   console.log(that.data.openid)
    
  // },
  changeData: function () {
    var that = this;
    //this.onLoad();//最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
    that.setData({
      isLoading: true,
      mousList:[],
      commList:[],
      page: 1
    })
    that.getMousData();
  },
  //关闭新人遮罩层
  closeTask: function () {//关闭新人遮罩层
    var that = this;
    that.setData({
      isNewUser: false
    })

    wx.navigateTo({
      url: '../newUserTask/newUserTask?opid=' + this.data.opid,
    })
  },
  toNewTask: function () {
    wx.navigateTo({
      url: '../newUserTask/newUserTask?opid=' + this.data.opid,
    })
  },
  //下拉刷新监听函数

  onPullDownRefresh: function () {
    var that = this;
    //if(this.data.currentTab==0){ 
    //   this.setData({
    //     newsList: [],     
    //     page: 1
    //   })
    // }else{
    //   this.setData({
    //     //newsList: [],     
    //     makeupList: [], 
    //     page: 1
    //   })
    // }
    this.setData({
      newsList: [],
      makeupList: [], 
      mousList:[],
      commList:[],
      page: 1
    })
    
    that.getdata();
    that.getMoredata();
    that.getMousData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /*
    点击分享 
     
  */
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    clearInterval(this.data.loadingtime);
  },
  // shared: function (options){
  //   // var item = options.target.dataset.item;
  //   // this.onShareAppMessage(item);
  // },
  onShareAppMessage: function (res) {
    var item = res.target.dataset.item;
    var id = res.target.dataset.id;
    //console.log(item)
    if (res.from === 'button') {
      //console.log("666")
      return {
        title: '【邀你一起来匿名讨论】' + item,
        path: '/pages/anonymousDetails/anonymousDetails?id=' + id +'&isshare=1' ,
        success: function (res) {
          //console.log('成功', res)
        }
      }
    }
    return {
      title: this.data.titleName,
      imageUrl: app.globalData.imgUrl + this.data.imgesUrl,//图片地址
      path: '/pages/index/index',// 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        console.log("转发成功:");
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:");
      }
    }
  },
})

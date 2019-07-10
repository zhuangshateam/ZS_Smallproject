//app.js
import WxValidate from '/utils/WxValidate.js'
const vPush = require("/vpush-pro-sdk/vpush.pro.js");
var userTrajectory = require('/userTrajectory.js');

App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  vPush: new vPush('wxddd057056961255f'),
  WxValidate: (rules, messages) => new WxValidate(rules, messages),
  onLaunch: function () {
    var that = this;
    //获取用户操作轨迹
    userTrajectory.initUserTrajectory.apply(this, []);

    //隐藏系统tabbar
    wx.hideTabBar();
    //获取设备信息
    this.getSystemInfo();
      wx.showLoading({
        title: '登录中...',
      })
    wx.checkSession({
      success: function (res) {
        //console.log(res, '登录未过期')
        //调用登录接口，获取 code
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getSetting({
                success(setRes) {
                  // 判断是否已授权
                  // if (!setRes.authSetting['scope.userInfo']) {
                  //   console.log("wei")
                  //   wx.redirectTo({
                  //     url: '../login/login',
                  //   })
                  // } else {
                    //获取用户信息
                  //console.log(res.code)
                    wx.getUserInfo({
                      lang: "zh_CN",
                      success: function (userRes) {
                        //发起网络请求
                        wx.request({
                          url: 'https://www.izhuangsha.com/api/weixin/index.aspx',
                          data: {
                            opt: 'getWxUserInfo',
                            code: res.code,
                            encryptedData: userRes.encryptedData,
                            iv: userRes.iv
                          },
                          header: {
                            'content-type': 'application/json' // 默认值
                          },
                          success: function (result) {
                            var data = result.data;
                            var openid=result.data.openId;
                            // console.log(result.data.nickName)
                            that.globalData.openid = result.data.openId;
                            that.globalData.userInfo = result.data;
                            that.globalData.nickName = result.data.nickName;
                            that.globalData.avatarUrl = result.data.avatarUrl
                            wx.setStorageSync("userInfo", result.data);
                            wx.setStorageSync('openId', result.data.openId);
                          }
                          
                        })
                        
                        //console.log('用户信息', userRes.userInfo.nickName);
                        wx.hideLoading();
                      }
                      
                    })
                  }
                //}
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
                wx.redirectTo({
                  url: '../login/login',
                })
            }
          }
        })
      }
      // fail: function (res) {
      //   wx.redirectTo({
      //     url: '../login/login',
      //   })
      // }
    })
  },
  //获取用户信息接口
  getOpenid: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          //code 获取用户信息的凭证
          if (res.code) {
            //请求获取用户openid
            wx.request({
              url: that.globalData.api,
              data: { 
                opt: 'getWxUsers',
                code: res.code 
              },
              method: 'GET',
              header: {
                'Content-type': 'application/json'
              },
              success: function (res) {
                wx.setStorageSync('openid', res.data);//存储openid
                //console.log(res.data)
                that.globalData.openid = res.data;
                var res = {
                  status: 200,
                  data: res.data
                }
                // 获取用户信息
                wx.getSetting({
                  success: res => {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                      wx.getUserInfo({
                        success: res => {
                          // 可以将 res 发送给后台解码出 unionId
                          that.globalData.userInfo = res.userInfo

                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(res)
                          }
                          wx.setStorageSync("userInfo", res.userInfo);
                          that.globalData.nickName = res.userInfo.nickName;
                          that.globalData.avatarUrl = res.userInfo.avatarUrl
                        }
                      })
                    }
                  }
                })
                resolve(res);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject('error');
          }
        }
      })
    });
   
  },
getUserInfo: function (cb) {
    var that = this    
    if (this.globalData.userInfo) { 
      typeof cb == "function" && cb(this.globalData.userInfo) 
    } 
    else {
    //调用登录接口      
    wx.login({        
      success: function () {         
        wx.getUserInfo({            
           success: function (res) {              
             that.globalData.userInfo = res.userInfo              
             typeof cb == "function" && cb(that.globalData.userInfo)            
             }          
        })        
      }     
    })    
  }
},

     
  // 监听错误
  // onError: function (err) {
  //   // 上报错误
  //   console.log(err);
  //   wx.request({
  //     url: 'http://monitor.com/monitor/error',
  //     data: err
  //   })
  // },
  onShow: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    // Do something when page show.
    // 缓存用户打开的页面路径,授权后返回该页面
    // var urlWithArgs = ret.path + '?';
    // for (var key in ret.query) {
    //   var val = ret.query[key]
    //   urlWithArgs += key + '=' + val + '&'
    // }
    // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    // 把完整的url+参数统一缓存起来就行!在需要用的地方读取缓存
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: e => {
        t.globalData.systemInfo = e;
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    // wx.getSystemInfo({
    //   success: function (res) {
    //     t.globalData.systemInfo = res;
    //   }
    // });
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function (res) {
          //console.log('用户信息', res.userInfo)
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  /**
   * 设置全局变量
   */
  globalData: {
    openid:null,
    nickName: null,
    userInfo: null,
    avatarUrl:null,
    api: 'https://www.izhuangsha.com/api/weixin/index.aspx',
    imgUrl: 'https://www.izhuangsha.com/',
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/icon_index.png",
          "selectedIconPath": "icon/icon_index_red.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/curriculum/curriculum",
          "text": "课程",
          "iconPath": "icon/curriculum.png",
          "selectedIconPath": "icon/curriculum_red.png"
        },
        {
          "pagePath": "",
          "iconPath": "",
          "isSpecial": true,
          "text": "发布"
        },
        {
          "pagePath": "/pages/welfare/welfare",
          "text": "福利",
          "iconPath": "icon/welfare.png",
          "selectedIconPath": "icon/welfare_red.png"
        },
        {
          "pagePath": "/pages/home/home",
          "iconPath": "icon/icon_home.png",
          "selectedIconPath": "icon/icon_home_red.png",
          "text": "我的"
        }
      ]
    }
  },
  ajaxRequest: function (options) {
    wx.request({
      url: options.url,
      data: options.data,
      success: function (res) {
        options.success(res);
      }
    })
  },

})

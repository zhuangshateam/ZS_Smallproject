// pages/BargainIn/BargainIn.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dlist:[],
    userList:[],
    userCount:0,
    id:'',
    openid:'',   //发起砍价人ID
    appOpenid:'', //当前用户openid
    nickname:'',
    headimgurl:'',
    imageurl: 'https://www.izhuangsha.com',
    imgurl:'',
    hidden: false,
    isBargain:0,
    integralNum:0,  //积分
    integralScore:0,  //商品原积分
    page: 1,        //当前页
    pageSize: 4,    //页数
    copNumber:0, //份数
    loadText: '查看更多',
    loading:true,
    isshow: false,
    isCrits:false, //新人是否暴击
    userinfoCount:0,  //登录次数
    imgHIden:false,  //加载更多的下图标是否显示
    userInfo: {},
    isTopTrue: false,   //查询当前用户是否已兑换过--再次兑换同一产品将提示“你已兑换过，勿重复兑换”
    uid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/BargainIn_0', '进入砍积分页面');//获取用户轨迹
    var scene = decodeURIComponent(options.scene)
    //console.log(scene)
    if (scene == '' || scene == null || scene == 'undefined') {
      that.setData({
        id: options.id,
        openid: options.openid,
        nickname: options.nickname,
        headimgurl: options.headimgurl,
        imgurl: options.imgurl,
        appOpenid: wx.getStorageSync('openid'),
        userInfo: wx.getStorageSync("userInfo")
      })

    } else {
      var arr = scene.split(',');
      that.setData({
        id: parseInt(arr[0]) 
        //uid: parseInt(arr[1])
      })
      wx.request({  //查询openid与积分详情
        url: app.globalData.api,
        data: {
          opt: 'getIntegralOpenid',
          uid: arr[1]
        },
        success: function (res) {
          if (res.data.status === 0) {
            for (var i = 0; i < res.data.ds.length; i++) {
              that.setData({
                openid: res.data.ds[i].openid,  //openid
                nickname: res.data.ds[i].nickname,  //昵称
                headimgurl: res.data.ds[i].headimgurl,
                appOpenid: wx.getStorageSync('openid'),
                userInfo: wx.getStorageSync("userInfo")
              })
            }
            that.getdata();
          }
         
        }
      })
    }
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    app.userInfoReadyCallback = res => {
      that.setData({
        userInfo: res.userInfo
      })
      
    }
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          appOpenid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    
  

  },

  getdata:function(){
    var that=this;
    console.log(that.data.openid)
    console.log(that.data.id)
    that.setData({
      dlist:[],
      userList:[]
    })
    wx.request({  //获取商品详情
      url: app.globalData.api,
      data: {
        opt: 'getExchangeDetails',
        openid:this.data.openid,
        nid: this.data.id
      },
      success: function (res) {
        var list = that.data.dlist;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              imgurl: res.data.ds[i].imagesUrl,
              integralScore: res.data.ds[i].IntegralNum,  //积分
              copNumber: res.data.ds[i].Surplus_quantity  //份数
            })
            
            list.push(res.data.ds[i]);
          }

        }
        that.setData({
          dlist: list
        });
      }
    })
    wx.request({  //查询当前用户是否已经砍过积分？（当前产品）
      url: app.globalData.api,
      data: {
        opt: 'getexchangeOpenid',
        openid: that.data.appOpenid, //当前砍价用户ID
        userId: that.data.openid,   //发起砍价用户ID
        spid: this.data.id,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data==0){
          that.setData({
            isBargain: res.data
          });

        }else{
          that.setData({
            isBargain: 1
          });
        }

      }
    })
    wx.request({  //获取已砍积分
      url: app.globalData.api,
      data: {
        opt: 'getInScored',
        userId: this.data.openid,
        spid: this.data.id,
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        console.log(res.data.ds)
        var list = that.data.userList;
        if (res.data.status === 0) {
         // var arrlist=[];
          for (var i = 0; i < res.data.ds.length; i++) {
            //arrlist:  res.data.ds[i].Bargain_price
            that.setData({
              integralNum:res.data.ds[i].sumcont
            })
            list.push(res.data.ds[i]); 
          }
          that.setData({
            loading:true,
            userList: list,
            hidden: true
          })
          if (res.data.ds.length<4){
            that.setData({
              isshow: false,
              hidden: true,
            })
          }
          if (res.data.ds.length == 0|| that.data.userList.length==0) {
            that.setData({
              isshow: true
            })
          }
        }else{
          that.setData({
            loading: true,
            isshow: true,
            hidden: true
          })
          
        }
      }
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getInUserCount',
        openid: this.data.openid,
        spid: this.data.id
      },
      success: function (res) {
        if (res.data.status == 0) {
          that.setData({
            userCount: res.data.ds.length
          })
        }else{

          that.setData({
            userCount: 0
          })
        }
        
        
      }
    })
    wx.request({  //查询当前用户是否已经砍过积分(包括当前表中 是否存在当前openid--存在即为普通砍价，第一次进入即为“新人暴击”)
      url: app.globalData.api,
      data: {
        opt: 'getexchangeOpenidCrit',
        openid: that.data.appOpenid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          userinfoCount: res.data
        })

      }
    })
    wx.hideLoading()
  },

  //砍积分
  helpbindata:function(){
    var that = this;
    var isTrue = that.data.isTopTrue;
    if (that.data.copNumber == 0) {
      wx.showToast({
        title: '宝贝已经被抢光,无法继续砍积分！',
        icon: 'none',
        duration: 3000,
        mask: true
      })

    } else{
        if (isTrue == 'False') {
            var sumcont = this.data.integralScore-this.data.integralNum;
            //console.log(sumcont)
            if (sumcont<=200){
              wx.showToast({
                title: '该商品已经砍到最低了~',
                mask: true,
                icon: 'none'
              })
            }else{
              var infoCont = that.data.userinfoCount;
              if (parseInt(infoCont) <= 1 || parseInt(infoCont)==0){
                that.setData({
                  isCrits:true
                })

            
                var prandom = Math.floor(Math.random() * 20+20);
                if (parseInt(prandom) == 0) {
                  prandom = 1
                }
                wx.request({  //点击砍积分
                  url: app.globalData.api,
                  data: {
                    opt: 'getCutintegral',
                    userId: this.data.openid,
                    //openid: app.globalData.openid, appOpenid
                    openid:that.data.appOpenid, 
                    nickName: that.data.userInfo.nickName,
                    headimgurl: that.data.userInfo.avatarUrl,
                    integralNum: prandom,
                    spid: this.data.id,
                    isCrit: that.data.isCrits    //是否暴击
                  },
                  success: function (res) {
                    var lists = that.data.userList;
                    if (res.data == 1) {
                      that.getdata();
                      wx.showToast({
                        title: "砍积分成功",
                        icon: 'none',
                        duration: 2000
                      });
                    }
                    else {
                      wx.showToast({
                        title: '砍积分失败，请检查您的网络',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  }
                })
              }else{
                that.setData({
                  isCrits: false
                })
                var ppp = Math.floor(Math.random() * 20);
                if (parseInt(ppp)==0){
                  ppp=1
                }
                wx.request({  //点击砍积分
                  url: app.globalData.api,
                  data: {
                    opt: 'getCutintegral',
                    userId: this.data.openid,
                    //openid: app.globalData.openid,
                    openid: that.data.appOpenid, 
                    nickName: that.data.userInfo.nickName,
                    headimgurl: that.data.userInfo.avatarUrl,
                    integralNum: ppp,
                    spid: this.data.id,
                    isCrit: that.data.isCrits    //是否暴击
                  },
                  success: function (res) {
                    var lists = that.data.userList;
                    if (res.data == 1) {
                      that.getdata();
                      wx.showToast({
                        title: "砍积分成功",
                        icon: 'none',
                        duration: 2000
                      });
                    }
                    else {
                      wx.showToast({
                        title: '砍积分失败，请检查您的网络',
                        icon: 'none',
                        duration: 3000
                      })
                    }
                  }
                })
              }
          }
        }else{
          wx.showToast({
            title: '发起人已将商品兑换走了，无法继续砍积分',
            mask: true,
            icon: 'none'
          })
        }
    }
  },
  loadmore:function(){
    var that=this;
    // if (this.data.loadText=="查看更多"){
    //   wx.showToast({
    //     title: '暂无更多内容',
    //     mask: true,
    //     icon: 'none'
    //   })
    // }else{
    this.setData({
      loading: false,
      page: this.data.page + 1
    })
    wx.request({  //获取已砍积分
      url: app.globalData.api,
      data: {
        opt: 'getInScored',
        userId: this.data.openid,
        spid: this.data.id,
        page: that.data.page,
        pageSize: that.data.pageSize
      },
      success: function (res) {
        //console.log(res.data.status)
        var list = that.data.userList;
        if (res.data.status === 0) {
          // var arrlist=[];
          for (var i = 0; i < res.data.ds.length; i++) {
            //arrlist:  res.data.ds[i].Bargain_price
            that.setData({
              integralNum: res.data.ds[i].sumcont
            })
            list.push(res.data.ds[i]);
          }
          that.setData({
            loading: true,
            userList: list,
            hidden: true
          })
          // if (res.data.ds.length < 4) {
          //   that.setData({
          //     loading: true,
          //     imgHIden: true,
          //     loadText: '已加载完全部了',
          //   })
          // }
        } 
        else {
          that.setData({
            loading:true,
            imgHIden:true,
            loadText: '已加载完全部了',
          })

        }
      }
    })
    
  },
  //发起我的砍价
  paymentBtn:function(){
    if (this.data.copNumber == 0) {
      wx.showToast({
        title: '你下手慢了，宝贝已经被抢光了！',
        icon: 'none',
        duration: 3000,
        mask: true
      })

    }else{
      wx.navigateTo({
        url: '/pages/exchange_details/exchange_details?id=' + this.data.id,
      }) 
    }

  },
  //我也想要
  helMeTo:function(){
    wx.navigateTo({
      url: '/pages/exchange_details/exchange_details?id=' + this.data.id,
    }) 

  },
  goHome: function () {
    // wx.navigateTo({
    //   url: '../../pages/index/index',　// 页面 B
    // })
    wx.switchTab({
      url: '/pages/welfare/welfare'
    })

  },
  showBusy: function () {
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon: 'loading'
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
    var that = this;
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          //console.log("wei")
          wx.navigateTo({
            url: '../login/login',
          })
        }else{
          wx.getUserInfo({
            success: function (resl) {
              //console.log(resl.userInfo)
              that.setData({
                userInfo: resl.userInfo
              })
            },
            fail: function () {
              // fail
              console.log("获取失败！")
            },
            complete: function () {
              // complete
              console.log("获取用户信息完成！")
            }
          })
          wx.request({        //每个用户只能兑换一次，查询当前用户是否已兑换过--再次兑换同一产品将提示“你已兑换过，勿重复兑换”
            url: app.globalData.api,
            data: {
              opt: 'getexchangeSelect_In',
              openid: that.data.openid,
              spid: that.data.id
            },
            success: function (res) {
              that.setData({
                isTopTrue: res.data
              })
            }
          })
        }
      }
    })
    if (this.data.userInfo=="") {
      app.getUserInfo(function (userInfo) {
        //更新数据        
        that.setData({
          userInfo: userInfo
        })
        // console.log("userInfo:+" + userInfo.nickName)
        // console.log("用户数据存入当前页面");
      })
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    that.getdata();
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
    var that=this;
    that.setData({
      dlist:[],
      userList:[],
      page:1
    })
    that.getdata();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      //console.log(this.data.nickname)
      return {
        title: '【BA免费领】' + this.data.nickname+ '正在妆啥免费领礼品,点一下帮我砍积分',
        path: '/pages/BargainIn/BargainIn?id=' + this.data.id + '&openid=' + this.data.openid + '&nickname=' + this.data.nickname + '&headimgurl=' + this.data.headimgurl + '&imgurl=' + this.data.imgUrls,
        success: function (res) {
          console.log('成功', res)
        }
      }
    }
    return {
      title: '【BA免费领】' + this.data.nickname + '正在妆啥免费领礼品,点一下帮我砍积分',
      path: '/pages/BargainIn/BargainIn?id=' + this.data.id + '&openid=' + this.data.openid + '&nickname=' + this.data.nickname + '&headimgurl=' + this.data.headimgurl + '&imgurl=' + this.data.imgUrls,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})
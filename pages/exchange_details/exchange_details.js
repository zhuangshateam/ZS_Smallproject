var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    ehList:[],
    userList: [],
    openid:'',
    id:'',
    title:'',
    imgUrls:'',
    headimgurl:'',
    nickName:'',
    curIndex: 0,
    imageurl:'https://www.izhuangsha.com',
    animationData: {}, //内容动画
    animationMask: {}, //蒙板动画
    showVideo: false,
    userCount: 0,   //该商品所砍积分总数
    integraUserNum:0, //该用户的已有积分
    integralNum: 0,  //商品原有积分
    integralNumCount:0,//已砍掉多少积分
    ruleText:'',
    copNumber:0,    //商品份数
    page: 1,        //当前页
    pageSize: 4,    //页数
    loadText: '查看更多',
    imgHIden: false,  //加载更多的下图标是否显示
    loading: true,
    isshow:false,
    // appOpenid:'',
    codeImg:'',//小程序二维码的生成
    loadingtime: '',
    isTopTrue: false,   //查询当前用户是否已兑换过--再次兑换同一产品将提示“你已兑换过，勿重复兑换”
    wxUserId:'',   //本地数据库中用户表ID
    isshare:0
  },
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/exchange_details_0', '进入积分兑换详情页面');//获取用户轨迹
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    this.setData({
      id: options.id,
      nickName: app.globalData.nickName,
      openid: app.globalData.openid,
      headimgurl: app.globalData.avatarUrl
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        //console.log(res.data);
      }
    }); 
    this.animateTrans = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })

    this.animateFade = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    that.getdata();
    that.getQrcode();
    wx.hideLoading();
    // var scene = decodeURIComponent(options.scene)
  },
  
  getdata: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.setData({
      loading: false,
    })
    wx.request({  //获取积分兑换详情
      url: app.globalData.api,
      data: {
        opt: 'getExchangeDetails',
        nid: this.data.id
      },
      success: function (res) {
        
        var list = that.data.ehList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            //console.log(res.data.ds[i].imagesUrl)
            var article = res.data.ds[i].Details_introduce;
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({
              title: res.data.ds[i].exchange_Name,
              imgUrls: res.data.ds[i].imagesUrl,
              integralNum: res.data.ds[i].IntegralNum,
              copNumber: res.data.ds[i].Surplus_quantity,
              ruleText: res.data.ds[i].ruleText
            })
            list.push(res.data.ds[i]);
          }


        }
        that.setData({
          ehList: list
        });
      }
    })
    wx.request({  //查询该用户积分是否不足
      url: app.globalData.api,
      data: {
        opt: 'getUsintegralDefi',
        openid: this.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          integraUserNum: res.data
        });
      }
    })
    wx.request({  //查询当前用户是否已经砍过积分？
      url: app.globalData.api,
      data: {
        opt: 'getexchangeOpenid',
        openid: that.data.openid,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          isBargain: res.data
        });
      }
    })
    wx.request({  //查询有多少好友砍积分
      url: app.globalData.api,
      data: {
        opt: 'getUserInScoredCount',
        userId: this.data.openid,
        spid: this.data.id,
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          userCount: res.data
        });
      }
    })
    //console.log(this.data.openid)
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
        //console.log(res.data)
        var list = that.data.userList;
        if (res.data.status === 0) {
          // var arrlist=[];
          for (var i = 0; i < res.data.ds.length; i++) {
            //console.log(res.data.ds[i].headimgurl)
            that.setData({
              integralNumCount: res.data.ds[i].sumcont
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
          //     loadText: '暂无更多'
          //   })
          // }
        } else {
          that.setData({
            loading: true,
            loadText: '已加载完全部了',
            imgHIden: true,
          })
        }
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
            isTopTrue:res.data
          })
      }
    })

    loadingtime: setInterval(function () {
      wx.hideLoading()
    }, 2000)
  },
  loadmore: function () {
    // if (this.data.loadText == "已加载完全部了") {
    //   wx.showToast({
    //     title: '已经加载完全部了',
    //     mask: true,
    //     icon: 'none'
    //   })
    // } else {
      this.setData({
        loading: false,
        page: this.data.page + 1
      })
      this.getdata();

  },
  //调用子组件的方法
  getSharePoster: function () {
    var that=this;
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getSelectQrcode',
        openid: that.data.openid,
        spid: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        
        if (res.data=="0"){
          console.log("6666"+res.data)
          that.getQrcode();
        }else{
          //console.log("yicunz"+res.data)
          console.log("fei0"+res.data)
          that.setData({
            codeImg: res.data
          })
        }
      }
    })
    that.setData({ showVideo: false })
    that.selectComponent('#getPoster').getAvaterInfo()

  },
  //获取二维码
  getQrcode: function () {
    var that = this;
    wx.request({        //根据openid查询wxuserinfo用户ID
      url: app.globalData.api,
      data: {
        opt: 'getWxId',
        openid: that.data.openid
      },
      success: function (res) {
        //console.log(res.data)
        if (res.data != '') {
          var _jsonData = {
            page: 'pages/BargainIn/BargainIn',
            width: 430,
            scene: that.data.id + ',' + res.data
          }
          wx.request({
            // 调用接口C
            url: app.globalData.api,
            data: {
              opt: 'getQrcode',
              jsonData: _jsonData,
              spid: that.data.id,
              openid: that.data.openid
            },
            success(ress) {
              console.log(ress.data)
              //let base64 = wx.arrayBufferToBase64(ress.data)
              //console.log("base64"+base64)
              that.setData({
                codeImg: ress.data
              })
              //console.log(that.data.codeImg)
              // that.setData({
              //   codeImg: 'data:image/PNG;base64,' + base64
              // })
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      }
    })
    
  },
  //获取二维码
  // getQrcode: function () {
  //   var that = this;
  //   wx.request({
  //     url: 'https://api.weixin.qq.com/cgi-bin/token',
  //     header: { 'content-type': 'application/x-www-form-urlencoded' },
  //     data: {
  //       grant_type: 'client_credential',
  //       appid: 'wxddd057056961255f',//小程序开发者进入后台可以看到
  //       secret: '35fca9577b019a49434061c1e91befba'//小程序开发者进入后台可以看到
  //     },
  //     success: function (res) {
  //       //console.log(res.data.access_token)
  //       wx.request({
  //         // 调用接口C
  //         url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
  //         method: 'POST',
  //         dataType: 'json',
  //         responseType: 'arraybuffer',
  //         data: {
  //           page: 'pages/BargainIn/BargainIn',
  //           width: 430,
  //           scene: that.data.id + ',' + that.data.openid,
  //           is_hyaline: true
  //         },
  //         header: {
  //           'content-type': 'application/json;charset=utf-8'
  //         },
  //         success(ress) {
  //           console.log(ress)
  //           let base64 = wx.arrayBufferToBase64(ress.data)
  //           //console.log(base64)
  //           that.setData({
  //             codeImg: 'data:image/PNG;base64,' + base64
  //           })

  //           console.log(that.data.codeImg)
  //         },
  //         fail(err) {
  //           console.log(err)
  //         },
  //         complete: function (res) { },
  //       })
  //     }
  //   })

  // },
  myEventListener: function (e) {
    this.setData({ showVideo: true })
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  goHome:function(){
    wx.switchTab({
      url: '/pages/welfare/welfare'
    })

  },
  paymentBtn:function(){
    var that=this;
    var ucont = that.data.integraUserNum;//个人的全部积分
    var spcont = that.data.integralNum; //商品积分
    var cutNum = this.data.integralNumCount;//已砍商品积分
    //计算商品积分减去已砍过积分
    var payNum = parseInt(spcont) - parseInt(cutNum);
    if (parseInt(ucont) < payNum){
      that.showModal();
    }
    else{
      if (that.data.copNumber==0){
        wx.showToast({
          title: '你下手慢了，宝贝已经被抢光了！',
          icon: 'none',
          duration: 3000,
          mask: true
        })

      } else {
        var isTrue = that.data.isTopTrue;
        if (isTrue == 'False') {
          wx.navigateTo({
            url: '/pages/exchangeFrom/exchangeFrom?id=' + that.data.id + '&countNum=' + that.data.integralNumCount + '&payNum=' + payNum + '&integraUserNum=' + that.data.integraUserNum + '&copNumber=' + that.data.copNumber,
          })
        } else {
          wx.showToast({
            title: '你已兑换过此产品，勿重复兑换',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      }
      
    }
  },
  showModal(e) {
    this.setData({
      modalName: 'Modal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
* 回到首页(分享的时候)
*/
  backHome: function () {
    wx.switchTab({
      url: '/pages/welfare/welfare'
    })
  },
/**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    clearInterval(this.data.loadingtime);
  },
  // 显示
  showModalbtn: function () {
    var isTrue = this.data.isTopTrue;
    if (this.data.copNumber == 0) {
      wx.showToast({
        title: '你下手慢了，宝贝已经被抢光了！',
        icon: 'none',
        duration: 3000,
        mask: true
      })

    }else{
      if (isTrue == 'False') {
        this.animateTrans.translateY(0).step()
        this.animateFade.opacity(1).step()
        this.setData({
          animationData: this.animateTrans.export(), //动画实例的export方法导出动画数据传递给组件的animation属性
          animationMask: this.animateFade.export()
        })
      } else {
        wx.showToast({
          title: '你已兑换过此产品，无法继续砍积分！',
          icon: 'none',
          duration: 3500,
          mask: true
        })
      }
    }
      
  },

  // 隐藏
  hideModalbtn: function () {
    this.animateTrans.translateY(300).step()
    this.animateFade.opacity(0).step()
    this.setData({
      animationData: this.animateTrans.export(),
      animationMask: this.animateFade.export()
    })
  },
  onShow: function () {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log("wei")
          wx.redirectTo({
            url: '../login/login',
          })
        }
      }
    })
  },
  //转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      //获取用户轨迹
      getApp().getUserTrajectory(3, 'onLoad', 'pages/exchange_details_1', '点击了邀请好友砍积分');//获取用户轨迹
      return {
        title: '【BA免费领】' + '我正在妆啥免费领礼品,点一下帮我砍积分',
        path: '/pages/BargainIn/BargainIn?id=' + this.data.id + '&openid=' + this.data.openid + '&nickname=' + this.data.nickName + '&headimgurl=' + this.data.headimgurl + '&imgurl=' + this.data.imgUrls,
        imageUrl: this.data.imageurl+this.data.imgUrls,
        success: function (res) {
          console.log('成功', res)
        }
      }
    }
    return {
      title: this.data.title,
      path: 'pages/exchange_details/exchange_details?id=' + this.data.id + '&isshare=1',
      imageUrl: this.data.imageurl + this.data.imgUrls, //这是我的图片路径
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
  //下拉刷新监听函数

  onPullDownRefresh: function () {
    this.setData({    
      ehList: [],
      userList:[],
      page: 1
    })
    this.getdata();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

})
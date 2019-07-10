// pages/exchangeFrom/exchangeFrom.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addList:[],
    uname:'',
    phoneNum:'',
    city:'',
    province:'',
    region:'',
    address:'',
    id:'',  //商品ID
    dlist:[], //商品详情
    imageurl: 'https://www.izhuangsha.com',
    countNum:'',  //已砍积分
    payNum:'',  //还需支付积分
    integraUserNum:'',  //当前用户的所有积分
    copNumber:'', //商品份数
    submitHidden: true,
    loading: false,
    disabled:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/exchangeFrom_0', '进入积分兑换中确认兑换页面');//获取用户轨迹
    this.setData({
      id: options.id,
      countNum: options.countNum,
      payNum: options.payNum,
      integraUserNum: options.integraUserNum,
      copNumber: options.copNumber
    })
    wx.request({  //查询地址
      url: app.globalData.api,
      data: {
        opt: 'getAddresslistALL',
        openid: app.globalData.openid,
      },
      success: function (res) {
        //console.log(res.data.ds)
        var list = that.data.addList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            list.push(res.data.ds[i]);
          }

        }
        that.setData({
          addList: list
        });
      }
    })
    wx.request({  //获取商品详情
      url: app.globalData.api,
      data: {
        opt: 'getExchangeDetails',
        nid: this.data.id
      },
      success: function (res) {
        //console.log(res.data.ds)
        var list = that.data.dlist;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              integralScore: res.data.ds[i].IntegralNum
            })

            list.push(res.data.ds[i]);
          }

        }
        that.setData({
          dlist: list
        });
      }
    })
  },
  getAddress:function(){
    var that = this;
      wx.getSetting({
        success(res) {
          console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
          if (res.authSetting['scope.address']) {
            wx.chooseAddress({
              success(res) {
                that.setData({
                  uname: res.userName,
                  phoneNum: res.telNumber,
                  city: res.provinceName,
                  province: res.cityName,
                  region: res.countyName,
                  address: res.detailInfo
                })
                // console.log(res.userName)
                // console.log(res.postalCode)
                // console.log(res.provinceName)
                // console.log(res.cityName)
                // console.log(res.countyName)
                // console.log(res.detailInfo)
                // console.log(res.nationalCode)
                // console.log(res.telNumber)
              }
            })
            // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

          } else {
            if (res.authSetting['scope.address'] == false) {
              console.log("222")
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)

                }
              })
            } else {
              console.log("eee")
              wx.chooseAddress({
                success(res) {
                  console.log(res.userName)
                  console.log(res.postalCode)
                  console.log(res.provinceName)
                  console.log(res.cityName)
                  console.log(res.countyName)
                  console.log(res.detailInfo)
                  console.log(res.nationalCode)
                  console.log(res.telNumber)
                }
              })
            }
          }
        }
      })
  },
  formSubmit: function (e) {
    var that=this;
    var interNum = parseInt(that.data.integraUserNum);//当前用户的所有积分
    var payNum = parseInt(that.data.payNum); //还需支付积分
    // if (payNum == '' || payNum == null || interNum == '' || interNum==null){
    //   wx.showToast({
    //     title: '读取数据失败,请返回重试',
    //     icon: 'none',
    //     duration: 2000,
    //     mask: true
    //   })
    // }else{
      if (interNum >= payNum) {
        if (that.data.uname != '' || that.data.phoneNum != '' || that.data.city != '' || that.data.province != '' || that.data.region != '' || that.data.address != '') {
          that.setData({ submitHidden: false, loading: true })
          wx.request({  //兑换成功
            url: app.globalData.api,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              opt: 'getExchangeSuccess',
              openid: app.globalData.openid,
              nickName: app.globalData.userInfo.nickName,
              headimgurl: app.globalData.userInfo.avatarUrl,
              spid: that.data.id,
              copNumber: that.data.copNumber,
              payInteNum: that.data.payNum,
              uname: that.data.uname,
              phoneNum: that.data.phoneNum,
              city: that.data.city,
              province: that.data.province,
              region: that.data.region,
              address: that.data.address,
              form_id: e.detail.formId,
            },
            success: function (res) {
              that.setData({ submitHidden: true, loading: false, disabled: true })
              if (res.data == 1) { 
                wx.showToast({
                  title: '兑换成功,正在跳转中...',
                  icon: 'none',
                  duration: 3000,
                  mask: true
                })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/Myexchange/Myexchange',
                  });
                }, 2000)
              } else {
                wx.showToast({
                  title: '兑换失败',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
              if (res.data.status == 2 || res.data.status == 3) {
                wx.showToast({
                  title: '兑换失败',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '请选择收货地址',
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }
      } else {
        wx.showToast({
          title: '积分不足',
          icon: 'none',
          duration: 3000,
          mask: true
        })
      }
    //}
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
// pages/curriDetails/curriDetails.js
var util = require('../../utils/util.js'); 
const bgMusic = wx.getBackgroundAudioManager()
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    img: "https://www.izhuangsha.com",
    imgUrl:'',
    brief:'',
    titleName:'',
    curIndex: 0,

    isOpen: false,//播放开关
    // starttime: '00:00', //正在播放时长
    // durations: '',   //总时长
    src:'',//路径
    isshow:true,
    audioList:[],
    brief_content:'',
    label_one:'',
    label_two:'',
    autioName:'',
    bindex:0,
    autoCount:0,
    audioListCount:0,//共多少集
    isshare: 0,
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
    getApp().getUserTrajectory(5, 'onLoad', 'pages/curriDetails_0', '进入课程详情页');//获取用户轨迹
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    that.setData({
      id: options.id
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getCurrlunSingleID',
        id: that.data.id
      },
      success: function (res) {
        //console.log(res.data.ds)
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            that.setData({
              imgUrl: res.data.ds[i]["imagesUrl"],
              titleName: res.data.ds[i]["curriculumName"],
              brief: res.data.ds[i]["curri_brief"],
              brief_content: res.data.ds[i]["brief_content"],
              label_one: res.data.ds[i]["Label_one"],
              label_two: res.data.ds[i]["Label_two"],
            })

          }
        }
        else {
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 2000
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误",
          icon: 'none',
          duration: 2000
        })
      },//请求失败
    })

    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getCurriDetails',
        id: that.data.id
      },
      success: function (res) {
        //console.info(res.data.ds);
        var list = that.data.audioList;
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            res.data.ds[i]["DurationTime"] = util.timeToFormat(res.data.ds[i]["DurationTime"]);
            list.push(res.data.ds[i]);
          }
          that.setData({
            audioList: list,
            audioListCount: res.data.ds.length
          });
        }
        else {
          wx.showToast({
            title: "请求失败",
            icon: 'none',
            duration: 2000
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误",
          icon: 'none',
          duration: 2000
        })
      },//请求失败
    })
    setTimeout(function () {
      //要延时执行的代码
      wx.hideLoading()
    }, 2000) //延迟时间 这里是1秒
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  playAll:function(){
    var that = this
    var audioList = that.data.audioList;
    // console.log(audioList)
    // console.log(audioList[0]["id"])
    that.setData({
      bindexs: audioList[0]["id"],
    })

      bgMusic.title = audioList[0]["PlayName"]
      bgMusic.epname = audioList[0]["PlayName"]
      bgMusic.src = that.data.img + audioList[0]["filepaths"];
      bgMusic.onTimeUpdate(() => {
        //bgMusic.duration总时长  bgMusic.currentTime当前进度
        //console.log(bgMusic.currentTime)
        var duration = bgMusic.duration;
        var offset = bgMusic.currentTime;
        var currentTime = parseInt(bgMusic.currentTime);
        var min = "0" + parseInt(currentTime / 60);
        var max = parseInt(bgMusic.duration);
        var sec = currentTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        var starttime = min + ':' + sec;   /*  00:00  */
        that.setData({
          offset: currentTime,
          starttime: starttime,
          max: max,
          changePlay: true,
          isshow: false
        })
      })
      //播放结束
      bgMusic.onEnded(() => {
        this.autoPay(0);
      })

  },
  autoPay: function (index) {
    var that = this
    var id = parseInt(index)
    var num = id + 1
    var audioList = that.data.audioList;
    if (id + 1 > that.data.audioList.length - 1) {
      that.setData({
        bindexs: '',
      })
      wx.showToast({
        title: '已全部播放完毕',
        duration: 2000
      })
    } else {
      var audioId = audioList[num]["id"];
      that.setData({
        bindexs: audioId,
      })
      bgMusic.title = audioList[num]["id"]
      bgMusic.epname = audioList[num]["PlayName"]
      bgMusic.src = that.data.img + audioList[num]["filepaths"];
      bgMusic.onTimeUpdate(() => {
        //bgMusic.duration总时长  bgMusic.currentTime当前进度
        //console.log(bgMusic.currentTime)
        var duration = bgMusic.duration;
        var offset = bgMusic.currentTime;
        var currentTime = parseInt(bgMusic.currentTime);
        var min = "0" + parseInt(currentTime / 60);
        var max = parseInt(bgMusic.duration);
        var sec = currentTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        var starttime = min + ':' + sec;   /*  00:00  */
        that.setData({
          offset: currentTime,
          starttime: starttime,
          max: max,
          changePlay: true,
          isshow: false
        })
      })
      //播放结束
      bgMusic.onEnded(() => {
        this.autoPay(num);
      })
    }
    // wx.request({
    //   url: app.globalData.api,
    //   data: {
    //     opt: 'getautoPayId',
    //     aid: audioId
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       autoCount: res.data
    //     })
    //   }, fail: function (err) {
    //     wx.showToast({
    //       title: "网络错误",
    //       icon: 'none',
    //       duration: 2000
    //     })
    //   },//请求失败
    // })

  },
  // 播放
  listenerButtonPlay: function (e) {
    var that = this
    var bindex= e.currentTarget.dataset.id;
    // console.log(bindex)
    that.setData({
      bindexs: bindex
    })
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getDetailsAutioId',
        id: bindex
      },
      success: function (res) {
        if (res.data.status == 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            // //分钟计算
            // var minutes = util.formatSeconds(res.data.ds[i]["DurationTime"]);
            //console.log(minutes)
            that.setData({
              autioName: res.data.ds[i]["PlayName"],
              src: res.data.ds[i]["filepaths"],
            })
            //bug ios 播放时必须加title 不然会报错导致音乐不播放
            //console.log(that.data.autioName)
            bgMusic.title = res.data.ds[i]["PlayName"]
            bgMusic.epname = res.data.ds[i]["PlayName"]
            bgMusic.src = that.data.img + res.data.ds[i]["filepaths"];
            bgMusic.onTimeUpdate(() => {
              //bgMusic.duration总时长  bgMusic.currentTime当前进度
              //console.log(bgMusic.currentTime)
              var duration = bgMusic.duration;
              var offset = bgMusic.currentTime;
              var currentTime = parseInt(bgMusic.currentTime);
              var min = "0" + parseInt(currentTime / 60);
              var max = parseInt(bgMusic.duration);
              var sec = currentTime % 60;
              if (sec < 10) {
                sec = "0" + sec;
              };
              var starttime = min + ':' + sec;   /*  00:00  */
              that.setData({
                offset: currentTime,
                starttime: starttime,
                max: max,
                changePlay: true,
                isshow: false
              })
            })
            //播放结束
            bgMusic.onEnded(() => {
              that.setData({
                starttime: '00:00',
                bindexs: '',
                offset: 0
              })
              console.log("音乐播放结束");
            })
            bgMusic.play();
            that.setData({
              isshow: true
            })
          }
        }
        else {
          wx.showToast({
            title: "播放失败",
            icon: 'none',
            duration: 2000
          })
        }
      }, fail: function (err) {
        wx.showToast({
          title: "网络错误",
          icon: 'none',
          duration: 2000
        })
      },//请求失败
    })

    
  },
  //暂停播放
  listenerButtonPause() {
    var that = this
    bgMusic.pause()
    that.setData({
      bindexs: 0
    })
  },
  listenerButtonStop() {
    var that = this
    bgMusic.stop()
  },
  // 进度条拖拽
  sliderChange(e) {
    var that = this
    var offset = parseInt(e.detail.value);
    bgMusic.play();
    bgMusic.seek(offset);
  },
  // 页面卸载时停止播放
  onUnload() {
    var that = this
    that.listenerButtonStop()//停止播放
    console.log("离开")
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(this.data.imgUrls)
      
    }
    return {
      title: this.data.titleName,
      path: '/pages/curriDetails/curriDetails?id=' + this.data.id + '&isshare=1',//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
      imageUrl: this.data.img + this.data.imgUrl,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
      success: function (res) {
        // 转发成功
        var shareTickets = res.shareTickets;
        if (shareTickets == 0) {
          return false;
        }
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success:function(res){
        //     var encryptedData = res.encryptedData;
        //     var iv=res.iv;
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
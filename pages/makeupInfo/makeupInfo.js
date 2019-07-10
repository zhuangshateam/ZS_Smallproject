// pages/makeupInfo/makeupInfo.js
var util = require('../../utils/util.js'); 
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: app.globalData.imgUrl,  //图片API地址
    makeupList: [],      //详情
    imgList: [],   //图片数组
    imgArray: [],  //点击图片预览存放的图片数组
    commentList: [],  //评论列表
    commenReplytList:[],
    comCount: 0, //评论条数
    id: '',
    currentTab1: 1,//0为经验;1:体验
    currentTab: 0,//详情tab切换
    isClick: false,  //是否收藏
    jobStorage: [],
    releaseFocus: false,
    star: 0,      //评分
    star1: 0,      //销售评分
    isshow:true,

    showEmojis: false, //控制emoji表情是否显示
    content:"",
    cfBg: false,
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [],//qq、微信原始表情
    oxf:[],
    publisher_openid: '',  //发布人的openid
    titleName: '',
    form_id: '', //form_id
    shareImg:'',  //分享转发图片
    isshare: 0, //分享页面显示返回首页按钮
    // 评论回复
    istrue: false,
    placeholder: '说点什么吧~',
    reply_userName: '',
    comid: '', //评论ID
    imgUrl:'https://www.izhuangsha.com/api',
    swiperCurrent: 0,
    loadingtime:'',  //定时器
    openid: '',

  },
  homepageBind:function(e){
    var that = this;
    //console.log(e.currentTarget.dataset.noid)
    var u_openid = e.currentTarget.dataset.noid;
    var headurl = e.currentTarget.dataset.headurl;
    var nickname = e.currentTarget.dataset.nickname;
    wx.navigateTo({
      url: '/pages/UserPsHome/UserPsHome?openid=' + u_openid + '&nickname=' + nickname + '&headurl=' + headurl,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    })
    // wx.request({
    //   url: app.globalData.api,
    //   data: {
    //     opt: 'getModelFrameComposition',
    //     noid: e.currentTarget.dataset.noid  //获取点击数据的ID，根据ID查出openid
    //   },
    //   success: function (res) {
    //     //console.log(res.data.ds)
    //     if (res.data.status == 0) {
    //       for (var i = 0; i < res.data.ds.length; i++) {
    //           var u_openid=res.data.ds[i]["openid"]
    //         wx.navigateTo({
    //           url: '/pages/UserPsHome/UserPsHome?openid=' + u_openid,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    //         })
    //       }
          
          
    //     }
    //   }
    // })
      
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
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
    getApp().getUserTrajectory(5, 'onLoad', 'pages/makeupInfo_0', '进入体验详情页');//获取用户轨迹
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    /**
    * 获取系统信息
    */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          clientHeight: res.windowHeight
        });
      }

    });
    //可以在页面 onLoad 中去获取页面 url 中的参数( 下面 onShareAppMessage 函数中配置)
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
    var scene = decodeURIComponent(options.scene)
    console.log(scene)
    if (scene == '' || scene == null || scene == 'undefined') {
      this.setData({
        id: options.id,
        releaseFocus: true,   //评论
        userId: app.globalData.openid,
      })

    } else {
      that.setData({
        id: options.scene,
      })
    }
    var em = {}, that = this, emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })

    this.loadMore();
    wx.request({  //获取详情页面标题内容等---作文详情
      url: app.globalData.api,
      data: {
        opt: 'getMakeupInfo',
        mkid: this.data.id
      },
      success: function (res) {
        //console.log(res.data.ds)
        var list = that.data.makeupList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            //console.log(res.data.ds[i]["headimgurl"])
            list.push(res.data.ds[i]);
            // that.setData({
            //   headimgurl: res.data.ds[i]["headimgurl"], //头像
            //   nickname: res.data.ds[i]["nickname"],  //昵称
            //   pinfen1: res.data.ds[i]["score"],//使用推荐指数
            //   pinfen2: res.data.ds[i]["sales_score"], //销售推荐指数
            //   productName: res.data.ds[i]["productName"], //标题
            //   sex: res.data.ds[i]["sex"],  //性别
            //   pifu: res.data.ds[i]["experientialSkin"], //皮肤特征
            //   age: res.data.ds[i]["sliderAge"], //年龄
            //   qizhi: res.data.ds[i]["productMakings"],//气质
            //   tiyan: res.data.ds[i]["usersExperience"], //体验
            //   tuiguang: res.data.ds[i]["productExtension"],  //推广
            //   xioafeizhe: res.data.ds[i]["consumer"], //消费者
            // })

            // 日期转换
            var dr = new Date(list[i]["Reviewtime"]);
            var times_r = dr.getFullYear() + '.' + (dr.getMonth() + 1) + '.' + dr.getDate();
            list[i]["Reviewtime"] = times_r;

            var d = new Date(list[i]["experienceTime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["experienceTime"] = times;

            var dd = new Date(list[i]["datetimeEnd"]);
            var dd_times = dd.getFullYear() + '.' + (dd.getMonth() + 1) + '.' + dd.getDate();
            list[i]["datetimeEnd"] = dd_times; 
            //改变已点赞的图标
            var cookie_mid = wx.getStorageSync('is_zan') || [];//获取全部点赞的mid
            for (let hh of cookie_mid) {
              if (res.data.ds[i].id == hh) {//遍历找到对应的id){

                that.setData({
                  [`makeupList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
            that.setData({
              publisher_openid: list[i]["openid"],
              form_id: list[i]["form_id"],
              titleName: list[i]["productName"]
            })
          }

        }
        that.setData({
          makeupList: list,
        });
      }
    })
    wx.request({  //获取图片
      url: app.globalData.api, //接口地址
      data: {
        opt: 'getPicture_BAimg',
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var imglist = that.data.imgList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            imglist.push(res.data.ds[i]);
            that.data.imgArray.push(res.data.ds[i]["imagesUrl"])
          }
          that.setData({
            shareImg: res.data.ds[0].imagesUrl
          })
        }else{
          wx.request({  //转发
            url: app.globalData.api,
            data: {
              opt: 'getForwardImg'
            },
            success: function (res) {
              that.setData({
                shareImg: app.globalData.imgUrl+res.data.ds[0].imgUrl
              })
            }
          })
        }
        that.setData({
          imgList: imglist
        });
      }
    })
    wx.request({  //获取是否为收藏
      url: app.globalData.api, //接口地址
      data: {
        opt: 'IsGetisCollection_Composition',
        id: this.data.id,
        userId: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status === 1) {
          that.setData({
            isClick: true

          });
        } else {
          that.setData({
            isClick: false

          });
        }
      }
    })
    loadingtime: setInterval(function () {
      wx.hideLoading();
    }, 2000)
    // setTimeout(function () {
    //   //要延时执行的代码
    //   wx.hideLoading()
    // }, 2000) //延迟时间 这里是1秒
  },
  
  // /**
  // * 点击回复
  // */
  bindReply: function (options) {
    var commentUserName = options.currentTarget.dataset.commentusername;//回复点击的用户名
    var comid = options.currentTarget.dataset.comid;//获取回复点击的评论ID
    var useropenid = options.currentTarget.dataset.useropenid;//获取点击回复 人的openid
    var from_id = options.currentTarget.dataset.fromid;//获取评论人的fromid
    this.setData({
      placeholder: '回复:',
      reply_userName: commentUserName,
      istrue: true,
      comid: comid,
      useropenid: useropenid,
      fromid: from_id
    })
  },
  blankCilck: function () {
    this.setData({
      placeholder: '说点什么吧~',
      reply_userName: '',
      istrue: false,
      comid: ''
    })
  },
  // 导航栏切换
  tabNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    }
    if (e.target.dataset.current == 0) {
      this.setData({
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
    } else if (e.target.dataset.current == 3) {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

  },
  bindChange: function (e) {
    var that = this;
    if (e.detail.current == 0) {
      this.setData({
        currentTab: e.detail.current,
      })
      return false;
    } else if (e.detail.current == 1) {
      this.setData({
        currentTab: e.detail.current
      })
    }
    else {
      this.setData({
        currentTab: e.detail.current
      })
    }
    that.setData({ currentTab: e.detail.current });


  },
  //评论删除
  delMakeupComment: function (options){
    var makeupid = options.currentTarget.dataset.makeupid;//此处找到列表的id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getcommentMakeupDelete',
              makeupid: makeupid,
            },
            success: function (res) {
              if (res.data === 1) {
                wx.showToast({
                  title: "删除成功",
                  duration: 3000,
                })
                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].loadMore()
                }

              } else {
                wx.showToast({
                  title: "删除失败",
                  image: '/images/rule-hide.png',
                })
              }

            }
          })
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  //   /**
// * 点赞
// */
  update_zan: function (options) {
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id
    //console.log(item_id);//列表id
    this.is_zan(item_id);
  },
  //点赞处理函数（xx.js文件）
  //点赞
  is_zan: function (item_id) {
    var that = this;
    var show;//传递到数据库点赞的状态      
    var zan_mid = wx.getStorageSync('is_zan') || []; //获取全部点赞的mid      
    var newmessage = [];
    for (var i = 0; i < that.data.makeupList.length; i++) {
      if (that.data.makeupList[i].id == item_id) {//遍历找到对应的id
        var num = that.data.makeupList[i].FabulousCount;//当前赞数
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
            [`makeupList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`makeupList[${i}].FabulousImg`]: "/images/Fabulous.png",
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
            [`makeupList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            [`makeupList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          zan_mid.unshift(item_id);//新增赞的mid
          wx.setStorageSync('is_zan', zan_mid);
          wx.showToast({
            title: "点赞成功!",
            icon: 'none'
          })

          wx.showShareMenu({
            withShareTicket: true
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
    that.changeParentData();
  },
  changeParentData: function () {

    var pages = getCurrentPages();//当前页面栈

    if (pages.length > 1) {

      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象

      beforePage.changeData();//触发父页面中的方法

    }

  },
  //评论回复删除
  delReplyComm_Make: function (options) {  //回复删除
    var mk_repid = options.currentTarget.dataset.mk_repid;//此处找到列表的id
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getReplyMakeupDelete',
              repid: mk_repid,
            },
            success: function (res) {
              if (res.data === 1) {
                wx.showToast({
                  title: "删除成功",
                  duration: 3000,
                })
                if (getCurrentPages().length != 0) {
                  //刷新当前页面的数据
                  getCurrentPages()[getCurrentPages().length - 1].loadMore()
                }

              } else {
                wx.showToast({
                  title: "删除失败",
                  image: '/images/rule-hide.png',
                })
              }

            }
          })
        } else if (sm.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  getDate: function (dates) {
    var n = dates * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    dates = Y + '-' + M + '-' + D;
    return dates
  },
  loadMore: function () {
    var that = this;
    this.setData({
      commentList: [],
      commenReplytList: []
    });
    wx.request({//获取评论列表
      url: app.globalData.api, //评论列表接口地址
      data: {
        opt: 'getCommentList_comment',
        id: this.data.id,
        currentTab: this.data.currentTab1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var commentlist = that.data.commentList;
        if (res.data.length != 0) {
          for (var i = 0; i < res.data.length; i++) {
            commentlist.push(res.data[i]);
            var cookie_mids = wx.getStorageSync('plmake_zan') || [];//获取全部点赞的mid
            for (let hh of cookie_mids) {
              if (res.data[i].id === hh) {//遍历找到对应的id){
                commentlist[i]["Fabulousimg"] = "/images/plzan_praise.png";
              }
            }

            // 日期转换
            var d = new Date(commentlist[i]["create_date"]);
            //var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            commentlist[i]["create_date"] = util.getToday(d);
            //将评论解码
            commentlist[i]["reply_msg"] = base.baseDecode(commentlist[i]["reply_msg"]);
            
            // 回复列表
            var commenReplytList = that.data.commenReplytList;
            for (var j = 0; j < res.data[i].chile.length; j++) {
              commenReplytList.push(res.data[i].chile[j])
              var cookie_mid = wx.getStorageSync('repMake_zan') || [];//获取全部点赞的mid
              for (let hh of cookie_mid) {
                if (res.data[i].chile[j].id === hh) {//遍历找到对应的id){
                  // that.setData({
                  //   [`commentlist[${i}].Fabulousimg`]: "/images/plzan_praise.png",
                  // })
                  commenReplytList[j]["Fabulousimg"] = "/images/plzan_praise.png";
                }
              }
            }
            that.setData({
              commenReplytList: commenReplytList
            })
          }
          that.setData({
            comCount: res.data.length,
            commentList: commentlist
          })
        }else{
          that.setData({
            comCount:0,
          })
        }
        if(commentlist.length>0){
          that.setData({
            isshow:false
          })
        }else{
          that.setData({
            isshow: true
          })
        }
        that.setData({
          commentList: commentlist
        });
      }
    })
  },
  haveSave(e) {
    if (!this.data.isClick == true) {
      console.log("进入收藏")
      wx.showToast({
        title: '已收藏',
      });
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getCollection_zuowen',
          id: this.data.id,
          openid: app.globalData.openid,
          istrue: this.data.isClick
        },
        success: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getCollection_zuowen',
          id: this.data.id,
          openid: app.globalData.openid,
          istrue: this.data.isClick
        },
        success: function (res) {
          console.log(res)
        }
      })
      wx.showToast({
        title: '已取消收藏',
      });
    }
    this.setData({
      isClick: !this.data.isClick
    })
  },
  /**
* 评论点赞
*/
  makeupFabulous: function (options) {
    var make_id = options.currentTarget.dataset.id;//此处找到列表文章的id
    var comid = options.currentTarget.dataset.comid; //评论的ID
    //console.log(item_id);//列表id
    this.make_zan(make_id, comid);
  },
  //点赞处理函数（xx.js文件）
  //点赞
  make_zan: function (make_id, comid) {
    var that = this;
    var isshow = 1; //点赞的状态     
    var zan_mid = wx.getStorageSync('plmake_zan') || []; //获取全部点赞的mid      
    var newmessage = [];
    for (var i = 0; i < that.data.commentList.length; i++) {
      if (that.data.commentList[i].id == comid) {//遍历找到对应的id
        var num = that.data.commentList[i].FabulousNum;//当前赞数
        if (zan_mid.includes(comid)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < zan_mid.length; j++) {
            if (zan_mid[j] == comid) {
              zan_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`commentList[${i}].FabulousNum`]: num, //es6模板语法（反撇号字符）
            [`commentList[${i}].Fabulousimg`]: "/images/plzan.png",
          })
          wx.setStorageSync('plmake_zan', zan_mid);
          wx.showToast({
            title: "取消点赞!",
            icon: 'none'
          })
          //console.log("前端取消点赞"+isshow)

        } else {
          ++num;
          that.setData({
            [`commentList[${i}].FabulousNum`]: num,//es6模板语法（反撇号字符）
            [`commentList[${i}].Fabulousimg`]: "/images/plzan_praise.png",
          })
          zan_mid.unshift(comid);//新增赞的mid
          wx.setStorageSync('plmake_zan', zan_mid);
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
            opt: 'MakeupCommentPraise',
            id: make_id,
            comid: comid,
            isadd: isshow,
            openid: app.globalData.openid,
          },
          success: function (res) {
            //console.info(res.data.ds);
            if (res.data.status == 0) {
              
            }
          }
        })
      }
    }
  },
   /**
* 回复点赞
*/
  replyFabulous_Makeup: function (options){
    var repid = options.currentTarget.dataset.rid;
    var nid = options.currentTarget.dataset.nid;//此处找到列表的id
    var comid = options.currentTarget.dataset.comid;
    this.rep_zan(repid, nid, comid);
  },
  //点赞处理函数（xx.js文件）
  rep_zan: function (rid, nid, comid) {
    var that = this;
    var isshow = 1; //点赞的状态    
    var cookie_mid = wx.getStorageSync('repMake_zan') || [];//获取全部点赞的mid       
    var newmessage = [];
    for (var i = 0; i < that.data.commenReplytList.length; i++) {
      if (that.data.commenReplytList[i].id == rid) {//遍历找到对应的id
        var num = that.data.commenReplytList[i].FabulousNum;//当前赞数
        if (cookie_mid.includes(rid)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < cookie_mid.length; j++) {
            if (cookie_mid[j] == rid) {
              cookie_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`commenReplytList[${i}].FabulousNum`]: num, //es6模板语法（反撇号字符）
            [`commenReplytList[${i}].Fabulousimg`]: "/images/plzan.png",
          })
          wx.setStorageSync('repMake_zan', cookie_mid);
          wx.showToast({
            title: "取消点赞!",
            icon: 'none'
          })
          //console.log("前端取消点赞"+isshow)

        } else {
          ++num;
          that.setData({
            [`commenReplytList[${i}].FabulousNum`]: num,//es6模板语法（反撇号字符）
            [`commenReplytList[${i}].Fabulousimg`]: "/images/plzan_praise.png",
          })
          cookie_mid.unshift(rid);//新增赞的mid
          wx.setStorageSync('repMake_zan', cookie_mid);
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
            opt: 'MakeupReplyPraise',
            id: nid,
            comid: comid,
            rid: rid,
            isadd: isshow,
            wx_userid: app.globalData.openid,
          },
          success: function (res) {
            console.log(res);
          }
        })
      }
    }
  },
  //点击键盘上的发送按钮
  send: function (e) {
    var that = this;
    if (that.data.comid != '') {
      console.log("进入回复")
      if (e.detail.value == "") {
        wx.showToast({
          title: "请输入回复内容!",
          icon: 'none'
        })
        return;
      }
      //将表情进行编码传入数据库
      //var contxt = base.baseEncode(e.detail.value.txt_Context);
      this.hideEmojis();
      // 提交回复
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiReplyComment_Makeup',
          currentTab: this.data.currentTab1,
          comid: this.data.comid,
          comment: e.detail.value,
          userId: app.globalData.openid,
          useropenid: that.data.useropenid,
          userPhoto: app.globalData.userInfo.avatarUrl,
          rep_nickName: app.globalData.userInfo.nickName,
          from_id: e.detail.formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data === 1) {
            that.loadMore();
            that.setData({
              form_info: '',
              content: '',
              showEmojis: false,
              cfBg: false
            });
            wx.showToast({
              title: "回复成功",
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: '评论失败，请检查您的网络',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
    else {
      console.log("进入评论")
      //提交
      //var form = e.detail.value;
      if (e.detail.value == "") {
        wx.showToast({
          title: "请输入评论!",
          icon: 'none'
        })
        return;
      }
      this.hideEmojis();
      //将表情进行编码传入数据库
      var contxt = base.baseEncode(e.detail.value);

      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiComment',
          currentTab: this.data.currentTab1,
          id: this.data.id,
          // comment: e.detail.value.txt_Context,
          comment: contxt,
          userId: app.globalData.openid,
          userName: app.globalData.userInfo.nickName,
          // replyCommentId: mydata.commentId,
          // replyUserName: mydata.replyUserName,
          userPhoto: app.globalData.userInfo.avatarUrl
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //console.log(res.data.status)
          //console.log(res.data.ds)
          if (res.data.status === 0) {
            that.loadMore();
            that.setData({
              form_info: '',
              content: '',
              showEmojis: false,
              cfBg: false
            });
            wx.showToast({
              title: "评论成功",
              icon: 'none',
              duration: 2000
            });

          } else {
            wx.showToast({
              title: '评论失败，请检查您的网络',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    } 
  },
  submitForm(e) {
    var that = this;
    if (that.data.comid != ''){
      console.log("进入回复")
      if (e.detail.value.txt_Context.length == 0) {
        wx.showToast({
          title: "请输入回复内容!",
          icon: 'none'
        })
        return;
      }
      //将表情进行编码传入数据库
      //var contxt = base.baseEncode(e.detail.value.txt_Context);
      this.hideEmojis();
      // 提交回复
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiReplyComment_Makeup',
          currentTab: this.data.currentTab1,
          comid: this.data.comid,
          comment: e.detail.value.txt_Context,
          userId: app.globalData.openid,
          useropenid: that.data.useropenid,
          userPhoto: app.globalData.userInfo.avatarUrl,
          rep_nickName: app.globalData.userInfo.nickName,
          from_id: e.detail.formId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data === 1) {
            that.loadMore();
            that.setData({
              form_info: '',
              content: '',
              showEmojis: false,
              cfBg: false
            });
            wx.showToast({
              title: "回复成功",
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: '评论失败，请检查您的网络',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })

      //发送推送通知
      // var myDate = util.formatTime(new Date());
      // var _jsonData = {
      //   touser: that.data.useropenid, //用户的openid
      //   template_id: 'IDTVvzE1vfVDj8GL1KZ1Ovbu45Los9yYE0Ue2HaF6Pc',//这个是申请的模板消息id，位置在微信公众平台/模板消息中添加并获取
      //   page: '/pages/makeupInfo/makeupInfo?id=' + this.data.id + '&currentTab=' + this.data.currentTab1, //点击通知跳转的页面
      //   form_id: e.detail.formId, //表单提交场景下，为 submit 事件带上的 formId

      //   //此处必须为data,只有人说value也可以,可能官方已经修复这个bug
      //   data: {
      //     "keyword1": { "value": app.globalData.userInfo.nickName, "color": "#173177" },
      //     "keyword2": { "value": e.detail.value.txt_Context, "color": "#173177" },
      //     "keyword3": { "value": myDate, "color": "#173177" },
      //     "keyword4": { "value": "请点击进入查看", "color": "#173177" },
      //     "keyword5": { "value": this.data.titleName, "color": "#173177" },
      //   },
      // }
      // wx.request({
      //   url: app.globalData.api,
      //   data: {
      //     opt: 'gettemplate',
      //     jsondata: _jsonData,
      //   },
      //   success: function (res) {
      //     console.log(res, "push msg");
      //   },
      //   fail: function (err) {
      //     console.log(err, "push err");
      //   }
      // });
    }
    else {
      console.log("进入评论")
      //提交
      var form = e.detail.value;
      if (form.txt_Context == "") {
        wx.showToast({
          title: "请输入评论!",
          icon: 'none'
        })
        return;
      }
      this.hideEmojis();
      //将表情进行编码传入数据库
      var contxt = base.baseEncode(form.txt_Context);

      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiComment',
          currentTab: this.data.currentTab1,
          id: this.data.id,
          // comment: e.detail.value.txt_Context,
          comment: contxt,
          userId: app.globalData.openid,
          userName: app.globalData.userInfo.nickName,
          // replyCommentId: mydata.commentId,
          // replyUserName: mydata.replyUserName,
          userPhoto: app.globalData.userInfo.avatarUrl
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //console.log(res.data.status)
          //console.log(res.data.ds)
          if (res.data.status === 0) {
            that.loadMore();
            that.setData({
              form_info: '',
              content:'',
              showEmojis:false,
              cfBg: false
            });
            wx.showToast({
              title: "评论成功",
              icon: 'none',
              duration: 2000
            });

          } else {
            wx.showToast({
              title: '评论失败，请检查您的网络',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })

      //发送推送通知
      // var myDate = util.formatTime(new Date());
      // var _jsonData = {
      //   touser: that.data.publisher_openid, //用户的openid
      //   template_id: 'cVl9gWClALiED4imw7_AtJltdFVvfvR9BIy2zQl9hAw',//这个是申请的模板消息id，位置在微信公众平台/模板消息中添加并获取
      //   page: '/pages/makeupInfo/makeupInfo?id=' + this.data.id + '&currentTab=' + this.data.currentTab1, //点击通知跳转的页面
      //   form_id: this.data.form_id, //表单提交场景下，为 submit 事件带上的 formId

      //   //此处必须为data,只有人说value也可以,可能官方已经修复这个bug
      //   data: {
      //     "keyword1": { "value": myDate, "color": "#173177" },
      //     "keyword2": { "value": this.data.titleName, "color": "#173177" },
      //   },
      // }
      // wx.request({
      //   url: app.globalData.api,
      //   data: {
      //     opt: 'gettemplate',
      //     jsondata: _jsonData,
      //   },
      //   success: function (res) {
      //     console.log(res, "push msg");
      //   },
      //   fail: function (err) {
      //     console.log(err, "push err");
      //   }
      // });
    } 
  },
  //文本域失去焦点时 事件处理
  textAreaBlur: function (e) {
    //获取此时文本域值
    this.setData({
      content: e.detail.value
    })

  },
  //文本域获得焦点事件处理
  textAreaFocus: function () {
    this.setData({
      showEmojis: false,
      cfBg: false
    })
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      showEmojis: !this.data.showEmojis,
      isLoad: false,
      cfBg: !this.data.false
    })
  },
  //表情选择
  emojiChoose: function (e) {
     console.log(e.currentTarget.dataset.oxf)
    //当前输入内容和表情合并
    this.setData({
      content: this.data.content + e.currentTarget.dataset.emoji,
      oxf: e.currentTarget.dataset.oxf
    })
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      showEmojis: true,
      cfBg: false
    })
  },
  //图片点击事件
  // previewImg: function (e) {
  //   //console.log(this.data.imgArray);
  //   var index = e.currentTarget.dataset.index;
  //   var images = this.data.imgArray
  //   // console.log(images)
  //   // console.log(index)
  //   wx.previewImage({
  //     current: images[index],  //当前预览的图片
  //     urls: images,  //所有要预览的图片
  //   })
  // },
  //图片点击事件2
  previewImg: function (e) {
    //console.log(this.data.imgArray);
    var index = e.currentTarget.dataset.index;
    var images = this.data.imgArray
    // console.log(images)
    // console.log(index)
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  // 隐藏表情选择框
  hideEmojis: function () {
    this.setData({ showEmojis: false });
  },
  // // 隐藏或显示表情选择框
  // toggleEmojis: function () {
  //   const { showEmojis, showFiles } = this.data;
  //   if (showFiles) {
  //     this.setData({
  //       showEmojis: true,
  //       showFiles: false,
  //     });
  //   } else {
  //     if (showEmojis) {
  //       this.setData({
  //         scrollHeight: `${windowHeight - inputHeight}px`,
  //         showEmojis: !showEmojis
  //       })
  //     } else {
  //       this.setData({
  //         scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
  //         showEmojis: !showEmojis
  //       });
  //       // this.goBottom(50);
  //     }
  //   }
  // },
  // inputFocus: function () {
  //   const { showEmojis, showFiles } = this.data;
  //   if (showEmojis || showFiles) {
  //     this.setData({
  //       scrollHeight: `${windowHeight - inputHeight}px`,
  //       showEmojis: false,
  //       showFiles: false,
  //     });
  //   }
  // },
  // // 点击表情
  // clickEmoji: function (e) {
  //   const { key } = e.currentTarget.dataset;
  //   const { msg } = this.data;
  //   this.setData({ msg: msg + key });

  // },
  // blurInput: function (e) {
  //   this.setData({
  //     msg: e.detail.value
  //   })
  // },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  circleFriends:function(){
    var that = this;
    wx.showLoading({
      title: '请稍等',
      duration: 3000,
      mask: true
    })

    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getSelectDetailsQrcode',
        openid: that.data.openid,
        spid: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data == "0") {
          that.getQrcode();
        } else {
          wx.navigateTo({
            url: '/pages/circleFriends/circleFriends?id=' + that.data.id + '&codeImg=' + res.data,
          });
        }
      }
    })
   

  },
  
  // //获取二维码
  getQrcode: function () {
    var that = this;
    var _jsonData = {
      page: 'pages/makeupInfo/makeupInfo',
      width: 430,
      scene: that.data.id
    }
    wx.request({
      // 调用接口C
      url: app.globalData.api,
      data: {
        opt: 'getQrcode_info',
        jsonData: _jsonData,
        spid: that.data.id,
        openid: that.data.openid
      },
      success(ress) {
        //console.log(ress.data)
        wx.navigateTo({
          url: '/pages/circleFriends/circleFriends?id=' + that.data.id + '&codeImg=' + ress.data,
        });
        // that.setData({
        //   codeImg: ress.data
        // })

      },
      fail(err) {
        console.log(err)
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.loadingtime);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  onPullDownRefresh() {
    loadingtime: setInterval(function () {
      wx.stopPullDownRefresh(); //停止下拉元点
    }, 3000)
    // setTimeout(() => {

    //   wx.stopPullDownRefresh(); //停止下拉元点

    // }, 3000)

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
  * 回到首页(分享的时候)
  */
  backHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    //console.log(this.data.shareImg)
    return {
      title: this.data.titleName,
      path: '/pages/makeupInfo/makeupInfo?id=' + this.data.id+ '&isshare=1',//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
      imageUrl: this.data.shareImg,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
      success: function (res) {
        // 转发成功
        //console.log(res)
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
// pages/newsinfo/newsinfo.js
var util = require("../../utils/util.js")
const base = require('../../utils/baseEncode.js');
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: app.globalData.imgUrl,  //图片API地址
    anonymousList: [],      //详情
    imgList: [],   //图片数组
    imgArray: [],  //点击图片预览存放的图片数组
    commentList: [],  //评论列表
    commenReplytList: [],  //回复列表
    comCount: 0, //评论条数
    id: '',
    openid: '',
    releaseFocus: false,
    imgurl: 'https://www.izhuangsha.com/api',
    showEmojis: false, //控制emoji表情是否显示
    content: "",
    cfBg: false,
    // emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    // emoji: [
    //   "60a", "60b", "60c", "60d", "60f",
    //   "61b", "61d", "61e", "61f",
    //   "62a", "62c", "62e",
    //   "602", "603", "605", "606", "608",
    //   "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
    //   "63a", "63b", "63c", "63d", "63e", "63f",
    //   "64a", "64b", "64f", "681",
    //   "68a", "68b", "68c",
    //   "344", "345", "346", "347", "348", "349", "351", "352", "353",
    //   "414", "415", "416",
    //   "466", "467", "468", "469", "470", "471", "472", "473",
    //   "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    // ],
    // emojis: [],//qq、微信原始表情
    // oxf: [],
    //publisher_openid: '',  //发布人的openid
    titleName: '',
    form_id: '', //form_id
    access_token: '',
    shareImg: '',  //分享转发图片,
    isshare: 0, //分享页面显示返回首页按钮
    imgisshow: true,
    //u_openid: '',
    placeholder: '说点什么吧~',
    reply_userName: '',
    istrue: false,
    /*****回复评论 */
    comid: '', //评论ID
    useropenid: '',
    isFold: true,
    fromid: '',//点击回复按钮获取fromid
    loadingtime: '', //清除延时器
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/anonymousDetails_0', '进入匿名详情页');//获取用户轨迹
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    //可以在页面 onLoad 中去获取页面 url 中的参数( 下面 onShareAppMessage 函数中配置)
    if (options.isshare == 1) {
      console.log('是分享进入');
      this.setData({
        isshare: options.isshare
      })
    }
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
    this.setData({
      id: options.id,
      releaseFocus: true   //评论
    })
    // var em = {}, that = this, emChar = that.data.emojiChar.split("-");
    // var emojis = []
    // that.data.emoji.forEach(function (v, i) {
    //   em = {
    //     char: emChar[i],
    //     emoji: "0x1f" + v
    //   };
    //   emojis.push(em)
    // });
    // that.setData({
    //   emojis: emojis
    // })

    that.loadMore();
    wx.request({  //获取详情页面内容等 --匿名区详情
      url: app.globalData.api,
      data: {
        opt: 'getAnonymousDetails', 
        aid: that.data.id
      },
      success: function (res) {
        var list = that.data.anonymousList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            // 日期转换
            // var d = new Date(list[i]["anonymous_time"]);
            // var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            // list[i]["anonymous_time"] = times;
            res.data.ds[i]["anonymous_content"] = base.baseDecode(res.data.ds[i]["anonymous_content"]);
            var article = res.data.ds[i]["anonymous_content"];
            WxParse.wxParse('article', 'html', article, that, 5);
            // 日期转换
            let d = new Date(res.data.ds[i]["anonymous_time"]).getTime();
            var times = util.timeHandle(d);
            //console.log(times)
            res.data.ds[i]["anonymous_time"] = times;
            list.push(res.data.ds[i]);
          }
          for (var y = 0; y < that.data.anonymousList.length; y++) {
            var zan_mid = wx.getStorageSync('niming_zan') || [];//获取全部点赞的mid
            for (let zan1 of zan_mid) {
              console.log(that.data.anonymousList[y].id)
              if (that.data.anonymousList[y].id == zan1) {//遍历找到对应的id){
                that.setData({
                  [`anonymousList[${y}].FabulousImg`]: "/images/Fabulous_praise.png",
                })
              }
            }
            
          }
          that.setData({
            anonymousList: list

          });
        }
        else {
          wx.showToast({
            title: '此条数据已不存在！',
            duration: 2000,
            mask: true
          })
        }
      }
    })
    wx.request({  //获取图片
      url: app.globalData.api, //接口地址
      data: {
        opt: 'getAnonymousPicture',
        id: that.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.ds)
        var imglist = that.data.imgList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            imglist.push(res.data.ds[i]);
            that.data.imgArray.push(res.data.ds[i]["imagesUrl"])
            //console.log(res.data.ds[i][0])
          }
          that.setData({
            shareImg: res.data.ds[0].imagesUrl,
            imgList: imglist,
          })
        } else {
          wx.request({  //转发
            url: app.globalData.api,
            data: {
              opt: 'getForwardImg'
            },
            success: function (res) {
              //console.log(res.data.ds[0].imgUrl)
              that.setData({
                shareImg: app.globalData.imgUrl + res.data.ds[0].imgUrl
              })
            }
          })
        }
      }
    })
    // wx.request({  //获取是否为收藏
    //   url: app.globalData.api, //接口地址
    //   data: {
    //     opt: 'IsGetisCollection',
    //     id: this.data.id,
    //     userId: that.data.openid,
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     //console.log(res.data.status)
    //     if (res.data.status === 1) {
    //       that.setData({
    //         isClick: true

    //       });
    //     } else {
    //       that.setData({
    //         isClick: false

    //       });
    //     }
    //   }
    // })
    loadingtime: setInterval(function () {
      wx.hideLoading();
    }, 1500)
    var pages = getCurrentPages();//当前页面栈

    if (pages.length > 1) {

      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象

      var currPage = pages[pages.length - 1]; // 当前页面，若不对当前页面进行操作，可省去

      // beforePage.setData({       //如果需要传参，可直接修改A页面的数据，若不需要，则可省去这一步

      //   id: res.data.data

      // })

      beforePage.changeData();//触发父页面中的方法

    }
  },
  loadMore: function () {
    var that = this;
    this.setData({
      commentList: [],
      commenReplytList: [],
    });
    wx.request({//获取评论列表
      url: app.globalData.api, //评论列表接口地址
      data: {
        opt: 'getAnonymousCommentList',
        id: this.data.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        //debugger;
        var commentlist = that.data.commentList;
        if (res.data.length != 0) {
          for (var i = 0; i < res.data.length; i++) {
            commentlist.push(res.data[i]);
            var cookie_mid = wx.getStorageSync('anonymousZan') || [];//获取全部点赞的mid
            for (let hh of cookie_mid) {
              if (res.data[i].id === hh) {//遍历找到对应的id){
                // that.setData({
                //   [`commentlist[${i}].Fabulousimg`]: "/images/plzan_praise.png",
                // })
                commentlist[i]["Fabulousimg"] = "/images/plzan_praise.png";
              }
            }
            // 日期转换
            var d = new Date(commentlist[i]["create_date"]);
            // // console.log(d)
            // var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            commentlist[i]["create_date"] = util.getToday(d);
            //console.log(commentlist[i]["create_date"])
            //将评论解码
            commentlist[i]["reply_msg"] = base.baseDecode(commentlist[i]["reply_msg"]);
            var replyid = res.data[i]["id"];
            // 回复列表
            //console.log(res.data[i].chile)
            var commenReplytList = that.data.commenReplytList;
            for (var j = 0; j < res.data[i].chile.length; j++) {
              commenReplytList.push(res.data[i].chile[j])
              var cookie_mid = wx.getStorageSync('rep_anonymousZan') || [];//获取全部点赞的mid
              for (let hh of cookie_mid) {
                if (res.data[i].chile[j].id === hh) {//遍历找到对应的id){
                  // that.setData({
                  //   [`commentlist[${i}].Fabulousimg`]: "/images/plzan_praise.png",
                  // })
                  commenReplytList[j]["Fabulousimg"] = "/images/plzan_praise.png";
                }
              }
              // 回复日期转换
              var d = new Date(commenReplytList[j]["create_date"]);
              commenReplytList[j]["create_date"] = util.getToday(d);
            }
           
            that.setData({
              commenReplytList: commenReplytList
            })
          }
          that.setData({
            comCount: res.data.length,
            commentList: commentlist
          })
        } else {
          that.setData({
            comCount: 0,
          })
        }
        if (commentlist.length > 0) {
          that.setData({
            imgisshow: false
          })
        } else {
          that.setData({
            imgisshow: true
          })
        }

      }
    })
  },
  clickLick_nimin: function (options) {
    var that = this;
    var item_id = options.currentTarget.dataset.id;//此处找到列表的id -经验
    that.isFabulousZan(item_id);
  },
  //点赞--匿名区
  isFabulousZan: function (item_id) {
    var that = this;
    var isshow_select = 1; //点赞的状态 
    //var show;//传递到数据库点赞的状态      
    var zan_niming = wx.getStorageSync('niming_zan') || [];//获取全部点赞的mid  
    for (var i = 0; i < that.data.anonymousList.length; i++) {
      var num = that.data.anonymousList[i].FabulousCount;//当前赞数
      if (parseInt(zan_niming) == parseInt(item_id)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < zan_niming.length; j++) {
            if (zan_niming[j] == item_id) {
              zan_niming.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow_select = 0;//点赞的状态
          //console.log([`mousList[${i}].Fabulousimg`])
          that.setData({
            [`anonymousList[${i}].FabulousCount`]: num, //es6模板语法（反撇号字符）
            [`anonymousList[${i}].FabulousImg`]: "/images/Fabulous.png",
            //isselect: 1
          })
          wx.setStorageSync('niming_zan', zan_niming);
        }else{
          isshow_select = 1;//点赞的状态
          ++num;
          //console.log(num)
          that.setData({
            [`anonymousList[${i}].FabulousCount`]: num,//es6模板语法（反撇号字符）
            //isselect: true,
            [`anonymousList[${i}].FabulousImg`]: "/images/Fabulous_praise.png",
          })
          zan_niming.unshift(item_id);//新增赞的mid
          wx.setStorageSync('niming_zan', zan_niming);
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
  },
  // haveSave(e) {
  //   var that = this;
  //   if (!that.data.isClick == true) {
  //     console.log("进入收藏")
  //     let jobData = that.data.jobStorage;
  //     //console.log(jobData)
  //     // jobData.push({
  //     //   jobid: jobData.length,
  //     //   id: this.data.id
  //     // })
  //     wx.setStorageSync('jobData', jobData);//设置缓存
  //     wx.showToast({
  //       title: '已收藏',
  //     });
  //     wx.request({
  //       url: app.globalData.api,
  //       data: {
  //         opt: 'getCollection',
  //         id: that.data.id,
  //         openid: that.data.openid,
  //         istrue: that.data.isClick
  //       },
  //       success: function (res) {
  //         console.log(res)
  //       }
  //     })
  //   } else {
  //     wx.request({
  //       url: app.globalData.api,
  //       data: {
  //         opt: 'getCollection',
  //         id: that.data.id,
  //         openid: that.data.openid,
  //         istrue: that.data.isClick
  //       },
  //       success: function (res) {
  //         console.log(res)
  //       }
  //     })
  //     wx.showToast({
  //       title: '已取消收藏',
  //     });
  //   }
  //   that.setData({
  //     isClick: !that.data.isClick
  //   })
  // },
  /**
* 评论点赞
*/
  upFabulous: function (options) {
    var nid = options.currentTarget.dataset.id;//此处找到列表的id
    var comid = options.currentTarget.dataset.comid;
    this.zan(nid, comid);
  },
  //回复点赞
  replyFabulous: function (options) {
    var repid = options.currentTarget.dataset.rid;
    var nid = options.currentTarget.dataset.nid;//此处找到列表的id
    var comid = options.currentTarget.dataset.comid;
    console.log(repid, nid, comid)
    this.rep_zan(repid, nid, comid);
  },
  //评论点赞处理函数（xx.js文件）
  zan: function (nid, comid) {
    //console.log(comid)
    var that = this;
    var isshow = 1; //点赞的状态    
    var cookie_mid = wx.getStorageSync('anonymousZan') || [];//获取全部点赞的mid       
    var newmessage = [];
    for (var i = 0; i < that.data.commentList.length; i++) {
      if (that.data.commentList[i].id == comid) {//遍历找到对应的id
        var num = that.data.commentList[i].FabulousNum;//当前赞数
        if (cookie_mid.includes(comid)) {//说明已经点过赞,取消赞   
          for (var j = 0; j < cookie_mid.length; j++) {
            if (cookie_mid[j] == comid) {
              cookie_mid.splice(j, 1);//删除取消赞的mid 
            }
          }
          --num;
          isshow = 0;//点赞的状态
          that.setData({
            [`commentList[${i}].FabulousNum`]: num, //es6模板语法（反撇号字符）
            [`commentList[${i}].Fabulousimg`]: "/images/plzan.png",
          })
          wx.setStorageSync('anonymousZan', cookie_mid);
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
          cookie_mid.unshift(comid);//新增赞的mid
          wx.setStorageSync('anonymousZan', cookie_mid);
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
            opt: 'getAnonymousCommentZan',
            id: nid,
            comid: comid,
            isadd: isshow,
            wx_userid: that.data.openid,
          },
          success: function (res) {
            console.log(res);
          }
        })
      }
    }
  },
  //回复点赞处理函数（xx.js文件）
  rep_zan: function (rid, nid, comid) {
    var that = this;
    var isshow = 1; //点赞的状态    
    var cookie_mid = wx.getStorageSync('rep_anonymousZan') || [];//获取全部点赞的mid       
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
          wx.setStorageSync('rep_anonymousZan', cookie_mid);
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
          wx.setStorageSync('rep_anonymousZan', cookie_mid);
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
            opt: 'ReplyAnonymousZan',
            id: nid,
            comid: comid,
            rid: rid,
            isadd: isshow,
            wx_userid: that.data.openid,
          },
          success: function (res) {
            console.log(res);
          }
        })
      }
    }
  },
  delReplyComm: function (options) {  //回复删除
    var repid = options.currentTarget.dataset.repid;//此处找到列表的id
    //console.log(repid)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getAnonymousReplyDelete',
              repid: repid,
            },
            success: function (res) {
              console.log(res.data)
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
  deleteComment: function (options) {  //匿名评论删除
    var commentid = options.currentTarget.dataset.commentid;//此处找到列表的id
    console.log(commentid)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: app.globalData.api,
            data: {
              opt: 'getAnonymousCommentDelete',
              commentid: commentid,
            },
            success: function (res) {
              console.log(res.data)
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
    //console.log(nid)

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
      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'SubmiAnonymousReplyComment',
          comid: this.data.comid,
          comment: e.detail.value,
          userId: that.data.openid,
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
          //console.log(res.data)
          //console.log(res.data.ds)
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
    } else {
      console.log("进入评论")
      if (e.detail.value == "") {
        wx.showToast({
          title: "请输入评论!",
          icon: 'none'
        })
        return;
      }
      //将表情进行编码传入数据库
      var contxt = base.baseEncode(e.detail.value);
      //console.log(contxt);
      this.hideEmojis();
      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiAnonymousComment',
          id: this.data.id,
          comment: contxt,
          userId: that.data.openid,
          userName: app.globalData.userInfo.nickName,
          userPhoto: app.globalData.userInfo.avatarUrl,
          from_id: e.detail.formId
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
  //提交表单
  submitForm(e) {
    var that = this;
    if (that.data.comid != '') {
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
      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'SubmiAnonymousReplyComment',
          comid: this.data.comid,
          comment: e.detail.value.txt_Context,
          userId: that.data.openid,
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
          //console.log(res.data)
          //console.log(res.data.ds)
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
    } else {
      console.log("进入评论")
      if (e.detail.value.txt_Context.length == 0) {
        wx.showToast({
          title: "请输入评论!",
          icon: 'none'
        })
        return;
      }
      //将表情进行编码传入数据库
      var contxt = base.baseEncode(e.detail.value.txt_Context);
      //console.log(contxt);
      this.hideEmojis();
      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiAnonymousComment',
          id: this.data.id,
          comment: contxt,
          userId: that.data.openid,
          userName: app.globalData.userInfo.nickName,
          userPhoto: app.globalData.userInfo.avatarUrl,
          from_id: e.detail.formId
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
  // 隐藏表情选择框
  hideEmojis: function () {
    this.setData({ showEmojis: false });
  },
  //图片点击事件
  previewImg: function (e) {
    //console.log(this.data.imgArray);
    var index = e.currentTarget.dataset.index;
    var images = this.data.imgArray
    // console.log(images)
    // console.log(index)
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
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
    wx.showShareMenu({
      withShareTicket: true
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
  onPullDownRefresh() {

    loadingtime: setInterval(function () {
      wx.stopPullDownRefresh(); //停止下拉元点
    }, 3000)

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
    var item = res.target.dataset.item;
    var id = res.target.dataset.id;
    console.log(item)
    if (res.from === 'button') {
      console.log("666")
      return {
        title: '【邀你一起来匿名讨论】' + item,
        path: '/pages/anonymousDetails/anonymousDetails?id=' + id + '&isshare=1',
        success: function (res) {
          console.log('成功', res)
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
  }
})
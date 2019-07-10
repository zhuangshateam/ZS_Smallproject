// pages/newsinfo/newsinfo.js
var util = require("../../utils/util.js")
const base = require('../../utils/baseEncode.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: app.globalData.imgUrl,  //图片API地址
    newsList:[],      //详情
    imgList:[],   //图片数组
    imgArray:[],  //点击图片预览存放的图片数组
    commentList:[],  //评论列表
    commenReplytList:[],  //回复列表
    comCount:0, //评论条数
    id: '',
    openid:'',
    currentTab:0,
    releaseFocus: false,
    imgurl:'https://www.izhuangsha.com/api',
    showEmojis: false, //控制emoji表情是否显示
    content: "",
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
    oxf: []  ,
    publisher_openid:'',  //发布人的openid
    titleName:'',
    form_id: '', //form_id
    access_token: '',
    shareImg: '',  //分享转发图片,
    isshare: 0, //分享页面显示返回首页按钮
    imgisshow:true,
    //u_openid: '',
    placeholder:'说点什么吧~',
    reply_userName:'',
    istrue:false,
    /*****回复评论 */
    comid:'', //评论ID
    useropenid:'',
    isFold: true,
    fromid: '',//点击回复按钮获取fromid
    loadingtime:'', //清除延时器
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
      placeholder:'回复:',
      reply_userName: commentUserName,
      istrue:true,
      comid: comid,
      useropenid:useropenid,
      fromid: from_id
    })
  },
  blankCilck:function(){
    this.setData({
      placeholder: '说点什么吧~',
      reply_userName: '',
      istrue: false,
      comid:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    //获取用户轨迹
    getApp().getUserTrajectory(5, 'onLoad', 'pages/newsinfo_0', '进入经验详情页');//获取用户轨迹
    that.setData({
      openid: wx.getStorageSync('openid')
    })
    // app.getOpenid().then(function (res) {
    //   if (res.status == 200) {
 
    //   } else {
    //     console.log(res.data);
    //   }
    // });
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
    var scene = decodeURIComponent(options.scene)
    //console.log(scene)
    if (scene == '' || scene == null || scene == 'undefined') {
      this.setData({
        id: options.id,
        releaseFocus: true   //评论
      })

    } else {
      that.setData({
        id: options.scene,
      })
    }

    
    //console.log(this.data.userId)
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
    wx.request({  //获取详情页面标题内容等 --日记详情
      url: app.globalData.api,
      data:{
        opt: 'getNewsInfo',
        nid:this.data.id,
        currentTab: this.data.currentTab
      },
      success: function (res) {
        //console.log(res.data.ds)
        var list = that.data.newsList;
        if (res.data.status===0){
          for(var i=0;i<res.data.ds.length;i++){
            //console.log(res.data.ds[i]["Reviewtime"])
            list.push(res.data.ds[i]);   
            //console.log(list[i]["Reviewtime"])
            // 日期转换
            var d = new Date(list[i]["Reviewtime"]);
            var times = d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate();
            list[i]["Reviewtime"] = times;
            
            that.setData({
              publisher_openid: list[i]["openid"],
              form_id: list[i]["form_id"],
              titleName: list[i]["ReviewTitle"]
            })
          }
          that.setData({
            newsList: list,

          });
        }
        else{
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
        opt: 'getPicture_img',
        id: this.data.id
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
                shareImg: app.globalData.imgUrl+res.data.ds[0].imgUrl
              })
            }
          })
        }
      }
    })
    wx.request({  //获取是否为收藏
      url: app.globalData.api, //接口地址
      data: {
        opt: 'IsGetisCollection',
        id: this.data.id,
        userId: that.data.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.status)
        if (res.data.status===1){
          that.setData({
            isClick:true

          });
        }else{
          that.setData({
            isClick: false

          });
        } 
      }
    })
    loadingtime: setInterval(function () {
      wx.hideLoading();
    }, 1500)
  },
  loadMore:function(){
    var that = this;
    this.setData({
      commentList:[],
      commenReplytList:[],
    });
    wx.request({//获取评论列表
      url: app.globalData.api, //评论列表接口地址
      data: {
        opt: 'getCommentList',
        id: this.data.id,
        currentTab: this.data.currentTab,
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
            var cookie_mid = wx.getStorageSync('plzan') || [];//获取全部点赞的mid
            for (let hh of cookie_mid) {
              if (res.data[i].id === hh) {//遍历找到对应的id){
                // that.setData({
                //   [`commentlist[${i}].Fabulousimg`]: "/images/plzan_praise.png",
                // })
                commentlist[i]["Fabulousimg"] ="/images/plzan_praise.png";
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
            var replyid=res.data[i]["id"];
            // 回复列表
            //console.log(res.data[i].chile)
            var commenReplytList = that.data.commenReplytList;
            for (var j = 0; j < res.data[i].chile.length; j++) {
              commenReplytList.push(res.data[i].chile[j])
              var cookie_mid = wx.getStorageSync('rep_zan') || [];//获取全部点赞的mid
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
  haveSave(e) {
    var that = this;
    if (!that.data.isClick == true) {
      console.log("进入收藏")
      let jobData = that.data.jobStorage;
      //console.log(jobData)
      // jobData.push({
      //   jobid: jobData.length,
      //   id: this.data.id
      // })
      wx.setStorageSync('jobData', jobData);//设置缓存
      wx.showToast({
        title: '已收藏',
      });
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getCollection',
          id: that.data.id,
          openid: that.data.openid,
          istrue: that.data.isClick
        },
        success: function (res) {
          console.log(res)
        }
      })
    } else {
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'getCollection',
          id: that.data.id,
          openid: that.data.openid,
          istrue: that.data.isClick
        },
        success: function (res) {
          console.log(res)
        }
      })
      wx.showToast({
        title: '已取消收藏',
      });
    }
    that.setData({
      isClick: !that.data.isClick
    })
  },
  /**
* 点赞
*/
  upFabulous: function (options) {
    var nid = options.currentTarget.dataset.id;//此处找到列表的id
    var comid = options.currentTarget.dataset.comid;
    this.zan(nid,comid);
  },
  replyFabulous: function (options){
    var repid = options.currentTarget.dataset.rid;
    var nid = options.currentTarget.dataset.nid;//此处找到列表的id
    var comid = options.currentTarget.dataset.comid;
    this.rep_zan(repid,nid, comid);
  },
  //点赞处理函数（xx.js文件）
  zan: function (nid, comid) {
    //console.log(comid)
    var that = this;
    var isshow = 1; //点赞的状态    
    var cookie_mid = wx.getStorageSync('plzan') || [];//获取全部点赞的mid       
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
          wx.setStorageSync('plzan', cookie_mid);
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
          wx.setStorageSync('plzan', cookie_mid);
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
  //点赞处理函数（xx.js文件）
  rep_zan: function (rid, nid, comid) {
    var that = this;
    var isshow = 1; //点赞的状态    
    var cookie_mid = wx.getStorageSync('rep_zan') || [];//获取全部点赞的mid       
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
          wx.setStorageSync('rep_zan', cookie_mid);
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
          wx.setStorageSync('rep_zan', cookie_mid);
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
            opt: 'ReplyFabulous',
            id: nid,
            comid:comid,
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
  delReplyComm: function (options){  //回复删除
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
              opt: 'getReplyDelete',
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

              }else{
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
  deleteComment: function (options) {  //日记评论删除
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
              opt: 'getcommentDelete',
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
  toShowModal(e) {
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
    //     opt: 'getModelFrame',
    //     noid: e.currentTarget.dataset.noid  //获取点击数据的ID，根据ID查出openid
    //   },
    //   success: function (res) {
    //     if (res.data.status == 0) {
    //       for (var i = 0; i < res.data.ds.length; i++) {
    //         that.setData({
    //           u_openid: res.data.ds[i]["openid"]
    //         })
    //       }
    //       wx.navigateTo({
    //         url: '/pages/UserPsHome/UserPsHome?openid=' + that.data.u_openid,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
    //       })
    //     }
    //   }
    // })
  },
  //点击键盘上的发送按钮
  send: function (e) {
    var that = this;
    console.log(e.detail.value)
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
          opt: 'submiReplyComment',
          currentTab: this.data.currentTab,
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
      //console.log("进入评论")
      if (e.detail.value == "") {
        wx.showToast({
          title: "请输入评论!",
          icon: 'none'
        })
        return;
      }
      //将表情进行编码传入数据库
      var contxt = base.baseEncode(e.detail.value);
      console.log(contxt);
      this.hideEmojis();
      // 提交评论
      wx.request({
        url: app.globalData.api,
        data: {
          opt: 'submiComment',
          currentTab: this.data.currentTab,
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
    if (that.data.comid!='') {
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
          opt: 'submiReplyComment',
          currentTab: this.data.currentTab,
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

      //发送推送通知
      // var myDate = util.formatTime(new Date());
      // console.log(that.data.useropenid);
      // console.log(app.globalData.userInfo.nickName)
      // var _jsonData = {
      //   touser: that.data.useropenid, //用户的openid
      //   template_id: 'IDTVvzE1vfVDj8GL1KZ1Ovbu45Los9yYE0Ue2HaF6Pc',//这个是申请的模板消息id，位置在微信公众平台/模板消息中添加并获取
      //   page: '/pages/newsinfo/newsinfo?id=' + this.data.id + '&currentTab=' + this.data.currentTab, //点击通知跳转的页面
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

    }else{
    //console.log("进入评论")
    if (e.detail.value.txt_Context.length==0) {
      wx.showToast({
        title: "请输入评论!",
        icon: 'none'
      })
      return;
    }
    //将表情进行编码传入数据库
    var contxt = base.baseEncode(e.detail.value.txt_Context);
    console.log(contxt);
    this.hideEmojis();
    // 提交评论
    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'submiComment',
        currentTab: this.data.currentTab,
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
      success: function (res)  {
        //console.log(res.data.status)
        //console.log(res.data.ds)
        if (res.data.status===0) {
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

    //发送推送通知
    // var myDate = util.formatTime(new Date());
    // var _jsonData = {
    //   touser: this.data.publisher_openid, //用户的openid
    //   template_id: 'cVl9gWClALiED4imw7_AtJltdFVvfvR9BIy2zQl9hAw',//这个是申请的模板消息id，位置在微信公众平台/模板消息中添加并获取
    //   page: '/pages/newsinfo/newsinfo?id=' + this.data.id + '&currentTab=' + this.data.currentTab, //点击通知跳转的页面
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

  //生成海报
  experiencePoster: function () {
    var that = this;
    wx.showLoading({
      title: '请稍等',
      duration: 3000,
      mask: true
    })

    wx.request({
      url: app.globalData.api,
      data: {
        opt: 'getSelectJingyanQrcode',
        openid: that.data.openid,
        spid: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data == "0") {
          console.log("6666" + res.data)
          that.getQrcode();
        } else {
          console.log("yicunz" + res.data)
          wx.navigateTo({
            url: '/pages/experiencePoster/experiencePoster?id=' + that.data.id + '&codeImg=' + res.data,
          });
        }
      }
    })

    // wx.showToast({
    //   title: "开发中",
    //   icon: 'none',
    //   duration: 2000
    // });
    // wx.navigateTo({
    //   url: '/pages/experiencePoster/experiencePoster?id=' + that.data.id,
    // });
  },
//获取二维码
  getQrcode: function () {
    var that = this;
    var _jsonData = {
      page: 'pages/newsinfo/newsinfo',
      width: 430,
      scene: that.data.id
    }
    wx.request({
      // 调用接口C
      url: app.globalData.api,
      data: {
        opt: 'getQrcode_info_jingyan',
        jsonData: _jsonData,
        spid: that.data.id,
        openid: that.data.openid
      },
      success(ress) {
        //console.log(ress.data)
        wx.navigateTo({
          url: '/pages/experiencePoster/experiencePoster?id=' + that.data.id + '&codeImg=' + ress.data,
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
  onPullDownRefresh: function () {

  },
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
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   return {
    //     title: this.data.titleName,
    //     path: '/pages/newsinfo/newsinfo?id=' + this.data.id + '& currentTab=' + this.data.currentTab,//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
    //     imageUrl: this.data.shareImg,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
    //     success: function (res) {
    //       // 转发成功
    //       var shareTickets = res.shareTickets;
    //       if (shareTickets == 0) {
    //         return false;
    //       }
    //       // wx.getShareInfo({
    //       //   shareTicket: shareTickets[0],
    //       //   success:function(res){
    //       //     var encryptedData = res.encryptedData;
    //       //     var iv=res.iv;
    //       //   }
    //       // })
    //     },
    //     fail: function (res) {
    //       // 转发失败
    //     }
    //   }
    // }
    return {
      title: this.data.titleName,
      path: '/pages/newsinfo/newsinfo?id=' + this.data.id +'&isshare=1',//这里在首页的地址后面添加我们需要传值的标识位pageId以及值123(pageId 这个名字你们可以自己随便乱取 如同一个变量名)
      imageUrl: this.data.shareImg,//自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG
      success: function (res) {
        // 转发成功
        var shareTickets = res.shareTickets;
        if (shareTickets == 0){
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
//index.js
const app = getApp()
Page({
  data: {
    painting: {},
    shareImage: '',
    mid:'',
    makeupList:[],  //详情
    imgList:[], //图片列表
    // 海报参数
    // headimgurl:'', //头像
    // nickname:'',  //昵称
    // productName:'', //标题
    // sex:'',
    // pifu:'',
    // age:'',
    // qizhi:'',
    // tiyan:'',
    // tuiguang:'',
    // xioafeizhe:'',
    pinfen1:'',
    pinfen2:'',
    img1:'',
    img2: '',
    img3: '',
    openid:'',
    imageurl: 'https://www.izhuangsha.com',
    codeImg:'',  //小程序码路径
  },
  onLoad(options) {
    var that=this;
    wx.showLoading({
      title: '读取中...'
    })
    app.getOpenid().then(function (res) {
      if (res.status == 200) {
        //console.log(wx.getStorageSync('openid'))
        that.setData({
          openid: wx.getStorageSync('openid')
        })
      } else {
        console.log(res.data);
      }
    });
    this.setData({
      mid: options.id, //id
      codeImg: options.codeImg
    })
    wx.request({  //获取图片
      url: app.globalData.api, //接口地址
      data: {
        opt: 'getPicture_BAimg',
        id: this.data.mid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var ilist = that.data.imgList;
        if (res.data.status === 0) {
          //console.log(res.data.ds.length)
          if (res.data.ds.length >= 3) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
              img2: res.data.ds[1].imagesUrl,
              img3: res.data.ds[2].imagesUrl,
            })
          }
          if (res.data.ds.length == 2) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
              img2: res.data.ds[1].imagesUrl
            })
          }
          if (res.data.ds.length == 1) {
            that.setData({
              img1: res.data.ds[0].imagesUrl,
            })
          }

          //console.log(res.data.ds[0].imagesUrl)
          for (var i = 0; i < res.data.ds.length; i++) {
            //console.log(res.data.ds[i]["imagesUrl"])

            ilist.push(res.data.ds[i]);
          }
        }
        that.setData({
          imgList: ilist
        });
      }
    })
    //console.log(that.data.imageurl + that.data.codeImg)
    //that.getdata();
  },
  
  onShow: function () {
    var that = this;
    that.getdata();
  },
  getdata:function(){
    var that=this;
    
    wx.request({  //获取详情页面标题内容等---作文详情
      url: app.globalData.api,
      data: {
        opt: 'getMakeupInfo',
        mkid: this.data.mid
      },
      success: function (res) {
        //console.log(res.data.ds)
        var list = that.data.makeupList;
        if (res.data.status === 0) {
          for (var i = 0; i < res.data.ds.length; i++) {
            
            that.setData({
              sex: res.data.ds[i]["sex"] == 1 ? '男' : '女'
            })
            console.log(that.data.img1)
            console.log(that.data.img2)
            console.log(that.data.img3)
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
            if (res.data.ds[i]["score"] == 1 ) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_1.png";
              that.setData({
                pinfen1: url
              })
            }
            if (res.data.ds[i]["score"] == 2 ) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_2.png";
              that.setData({
                pinfen1: url
              })
            }
            if (res.data.ds[i]["score"] == 3 ) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_3.png";
              that.setData({
                pinfen1: url
              })
            }
            if (res.data.ds[i]["score"] == 4 ) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_4.png";
              that.setData({
                pinfen1: url
              })
            }

            if (res.data.ds[i]["score"] == 5) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_5.png";
              that.setData({
                pinfen1: url
              })
            }
            if (res.data.ds[i]["sales_score"] == 1) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_1.png";
              that.setData({
                pinfen2: url
              })
            }
            if (res.data.ds[i]["sales_score"] == 2) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_2.png";
              that.setData({
                pinfen2: url
              })
            }
            if (res.data.ds[i]["sales_score"] == 3) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_3.png";
              that.setData({
                pinfen2: url
              })
            }
            if ( res.data.ds[i]["sales_score"] == 4) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_4.png";
              that.setData({
                pinfen2: url
              })
            }

            if ( res.data.ds[i]["sales_score"] == 5) {
              var url = "https://www.izhuangsha.com/api/images/jifen/integral_5.png";
              that.setData({
                pinfen2: url
              })
            }
            wx.showLoading({
              title: '绘制分享图片中',
              duration: 8000,
              mask: true
            })
            //console.log(that.data.pinfen1)
            that.setData({
              painting: {
                width: 375,
                height: 1155,
                clear: true,
                views: [
                  {
                    type: 'image',
                    url: 'https://www.izhuangsha.com/api/images/mek_bj.jpg',
                    top: 0,
                    left: 0,
                    width: 375,
                    height: 1155
                  },
                  {
                    type: 'image1',
                    url1: res.data.ds[i]["headimgurl"],
                    top: 40,
                    left: 150
                    // width: 80,
                    // height: 80
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["nickname"],
                    fontSize: 16,
                    color: '#EB70AB',
                    textAlign: 'center',
                    top: 120,
                    left: 178,
                    bolder: true
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["productName"],
                    fontSize: 17,
                    lineHeight: 22,
                    color: '#000',
                    textAlign: 'center',
                    top: 145,
                    left: 185,
                    width: 265,
                    MaxLineNumber: 2,
                    breakWord: true,
                    bolder: true
                  },

                  {
                    type: 'image',
                    url: that.data.pinfen1,
                    top: 188,
                    left: 65,
                    width: 70,
                    height: 15
                  },
                  {
                    type: 'text',
                    content: '使用推荐指数',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 210,
                    left: 60
                  },
                  {
                    type: 'image',
                    url: that.data.pinfen2,
                    top: 188,
                    left: 238,
                    width: 70,
                    height: 15
                  },
                  {
                    type: 'text',
                    content: '销售推荐指数',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'center',
                    top: 210,
                    left: 270
                  },
                  {
                    type: 'line',
                    startX: 24,
                    startY: 235,
                    endX: 350,
                    endY: 235,
                    style: '#DBDDDD',
                    lineWidth: 2
                  },
                  {
                    type: 'text',
                    content: that.data.sex,
                    fontSize: 14,
                    color: '#333',
                    textAlign: 'center',
                    top: 247,
                    left: 70
                  },

                  {
                    type: 'text',
                    content: res.data.ds[i]["sliderAge"],
                    fontSize: 14,
                    color: '#333',
                    textAlign: 'center',
                    top: 247,
                    left: 290
                  },

                  {
                    type: 'text',
                    content: '性别',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'center',
                    top: 267,
                    left: 70
                  },
                  {
                    type: 'text',
                    content: '年龄',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'center',
                    top: 267,
                    left: 290
                  },
                  {
                    type: 'line',
                    startX: 24,
                    startY: 290,
                    endX: 350,
                    endY: 290
                  },
                  {
                    type: 'rectangle',
                    x: 24,
                    y: 300,
                    w: 5,
                    h: 16,
                    r: 0,
                  },
                  {
                    type: 'text',
                    content: '皮肤特征',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 302,
                    left: 34
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["experientialSkin"],
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#666666',
                    textAlign: 'left',
                    top: 328,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 1,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'rectangle',
                    x: 24,
                    y: 350,
                    w: 5,
                    h: 16,
                    r: 0,
                  },
                  {
                    type: 'text',
                    content: '产品气质',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 352,
                    left: 34
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["productMakings"],
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#666666',
                    textAlign: 'left',
                    top: 378,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 5,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'rectangle',
                    x: 24,
                    y: 470,
                    w: 5,
                    h: 16,
                    r: 0,
                  },
                  {
                    type: 'text',
                    content: '使用体验',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 473,
                    left: 34
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["usersExperience"],
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#666666',
                    textAlign: 'left',
                    top: 500,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 5,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'rectangle',
                    x: 24,
                    y: 600,
                    w: 5,
                    h: 16,
                    r: 0,
                  },
                  {
                    type: 'text',
                    content: '产品推广',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 603,
                    left: 34
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["productExtension"],
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#666666',
                    textAlign: 'left',
                    top: 630,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 5,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'rectangle',
                    x: 24,
                    y: 720,
                    w: 5,
                    h: 16,
                    r: 0,
                  },
                  {
                    type: 'text',
                    content: '消费者',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 723,
                    left: 34
                  },
                  {
                    type: 'text',
                    content: res.data.ds[i]["consumer"],
                    fontSize: 12,
                    lineHeight: 18,
                    color: '#666666',
                    textAlign: 'left',
                    top: 750,
                    left: 50,
                    width: 265,
                    MaxLineNumber: 5,
                    breakWord: true,
                    bolder: true
                  },
                  {
                    type: 'image',
                    url: that.data.img1,
                    top: 850,
                    left: 38,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'image',
                    url: that.data.img2,
                    top: 850,
                    left: 144,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'image',
                    url: that.data.img3,
                    top: 850,
                    left: 250,
                    width: 90,
                    height: 80
                  },
                  {
                    type: 'line',
                    startX: 24,
                    startY: 955,
                    endX: 350,
                    endY: 955,
                    style: '#CDCDCD',
                    lineWidth: 2
                  },
                  {
                    type: 'image',
                    url: that.data.imageurl + that.data.codeImg,
                    top: 970,
                    left: 130,
                    width: 120,
                    height: 120
                  },
                  {
                    type: 'text',
                    content: '长按识别二维码，查看详情',
                    fontSize: 14,
                    color: '#666666',
                    textAlign: 'left',
                    top: 1100,
                    left: 100
                  },
                  // {
                  //   type: 'text',
                  //   content: '正品MAC魅可口红礼盒生日唇膏小辣椒Chili西柚情人',
                  //   fontSize: 16,
                  //   lineHeight: 21,
                  //   color: '#383549',
                  //   textAlign: 'left',
                  //   top: 336,
                  //   left: 44,
                  //   width: 287,
                  //   MaxLineNumber: 2,
                  //   breakWord: true,
                  //   bolder: true
                  // },
                  // {
                  //   type: 'text',
                  //   content: '￥0.00',
                  //   fontSize: 19,
                  //   color: '#E62004',
                  //   textAlign: 'left',
                  //   top: 387,
                  //   left: 44.5,
                  //   bolder: true
                  // },
                  // {
                  //   type: 'text',
                  //   content: '原价:￥138.00',
                  //   fontSize: 13,
                  //   color: '#7E7E8B',
                  //   textAlign: 'left',
                  //   top: 391,
                  //   left: 110,
                  //   textDecoration: 'line-through'
                  // },
                  // {
                  //   type: 'text',
                  //   content: '长按识别图中二维码帮我砍个价呗~',
                  //   fontSize: 14,
                  //   color: '#383549',
                  //   textAlign: 'left',
                  //   top: 460,
                  //   left: 165.5,
                  //   lineHeight: 20,
                  //   MaxLineNumber: 2,
                  //   breakWord: true,
                  //   width: 125
                  // }
                ]
              }
            })

          }

        }

      }
    })
    setTimeout(() => {

      wx.hideLoading()

    }, 6000)
  },
  // eventDraw() {
  //   wx.showLoading({
  //     title: '绘制分享图片中',
  //     mask: true
  //   })
  //   console.log("频分"+this.data.pinfen1)
  //   this.setData({
  //     painting: {
  //       width: 375,
  //       height: 1155,
  //       clear: true,
  //       views: [
  //         {
  //           type: 'image',
  //           url: 'https://www.izhuangsha.com/api/images/mek_bj.jpg',
  //           top: 0,
  //           left: 0,
  //           width: 375,
  //           height: 1155
  //         },
  //         {
  //           type: 'image1',
  //           url1: this.data.headimgurl,
  //           top: 40,
  //           left: 150
  //           // width: 80,
  //           // height: 80
  //         },
  //         {
  //           type: 'text',
  //           content: this.data.nickname,
  //           fontSize: 16,
  //           color: '#EB70AB',
  //           textAlign: 'left',
  //           top: 120,
  //           left: 178,
  //           bolder: true
  //         },
  //         {
  //           type: 'text',
  //           content: this.data.productName,
  //           fontSize: 17,
  //           lineHeight: 22,
  //           color: '#000',
  //           textAlign: 'center', 
  //           top: 145,
  //           left: 185,
  //           width: 265,
  //           MaxLineNumber: 2,
  //           breakWord: true,
  //           bolder: true
  //         },
          
  //         {
  //           type: 'image2',
  //           url2: this.data.pinfen1,
  //           top: 188,
  //           left: 65,
  //           width: 70,
  //           height: 15
  //         },
  //         {
  //           type: 'text',
  //           content: '使用推荐指数',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 210,
  //           left: 60
  //         },
  //         {
  //           type: 'image2',
  //           url2: this.data.pinfen2,
  //           top: 188,
  //           left: 238,
  //           width: 70,
  //           height: 15
  //         },
  //         {
  //           type: 'text',
  //           content: '销售推荐指数',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'center',
  //           top: 210,
  //           left: 270
  //         },
  //         {
  //           type: 'line',
  //           startX:24,
  //           startY:235,
  //           endX:350,
  //           endY: 235,
  //           style:'#DBDDDD',
  //           lineWidth:2
  //         },
  //         {
  //           type: 'text',
  //           content: this.data.sex==1?'男':'女',
  //           fontSize: 14,
  //           color: '#333',
  //           textAlign: 'center',
  //           top: 247,
  //           left: 70
  //         },
          
  //         {
  //           type: 'text',
  //           content: this.data.age,
  //           fontSize: 14,
  //           color: '#333',
  //           textAlign: 'center',
  //           top: 247,
  //           left: 290
  //         },

  //         {
  //           type: 'text',
  //           content: '性别',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'center',
  //           top: 267,
  //           left: 70
  //         },
  //         {
  //           type: 'text',
  //           content: '年龄',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'center',
  //           top: 267,
  //           left: 290
  //         },
  //         {
  //           type: 'line',
  //           startX: 24,
  //           startY: 290,
  //           endX: 350,
  //           endY: 290
  //         },
  //         {
  //           type: 'rectangle',
  //           x: 24,
  //           y: 300,
  //           w: 5,
  //           h: 16,
  //           r: 0,
  //         },
  //         {
  //           type: 'text',
  //           content: '皮肤特征',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 302,
  //           left: 34
  //         },
  //         {
  //           type: 'text',
  //           content: '皮肤敏感',
  //           fontSize: 12,
  //           lineHeight: 18,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 328,
  //           left: 50,
  //           width: 265,
  //           MaxLineNumber: 1,
  //           breakWord: true,
  //           bolder: true
  //         },
  //         {
  //           type: 'rectangle',
  //           x:24,
  //           y:350,
  //           w:5,
  //           h:16,
  //           r:0,
  //         },
  //         {
  //           type: 'text',
  //           content: '产品气质',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 352,
  //           left: 34
  //         },
  //         {
  //           type: 'text',
  //           content: '外观是一个绿色包装，很大一罐，比较实用。一打开就能闻到一股清香味。最吸引我的就是这个啦。里面是浅绿色膏体，中间夹杂着红色颗粒，一看就很吸引人。这款清洁霜是一个韩国进口的清洁霜，外包装标识着韩文，后面写有配方等等，是一个圆罐罐，打开能看到有个外盖上面放了一个小勺子。提示一下：用霜一类的都不能直接用手取量哦。',
  //           fontSize: 12,
  //           lineHeight: 18,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 378,
  //           left: 50,
  //           width: 265,
  //           MaxLineNumber: 5,
  //           breakWord: true,
  //           bolder: true
  //         },
  //         {
  //           type: 'rectangle',
  //           x: 24,
  //           y: 470,
  //           w: 5,
  //           h: 16,
  //           r: 0,
  //         },
  //         {
  //           type: 'text',
  //           content: '使用体验',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 473,
  //           left: 34
  //         },
  //         {
  //           type: 'text',
  //           content: '外观是一个绿色包装，很大一罐，比较实用。一打开就能闻到一股清香味。最吸引我的就是这个啦。里面是浅绿色膏体，中间夹杂着红色颗粒，一看就很吸引人。这款清洁霜是一个韩国进口的清洁霜，外包装标识着韩文，后面写有配方等等，是一个圆罐罐，打开能看到有个外盖上面放了一个小勺子。提示一下：用霜一类的都不能直接用手取量哦。',
  //           fontSize: 12,
  //           lineHeight: 18,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 500,
  //           left: 50,
  //           width: 265,
  //           MaxLineNumber: 5,
  //           breakWord: true,
  //           bolder: true
  //         },
  //         {
  //           type: 'rectangle',
  //           x: 24,
  //           y: 600,
  //           w: 5,
  //           h: 16,
  //           r: 0,
  //         },
  //         {
  //           type: 'text',
  //           content: '产品推广',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 603,
  //           left: 34
  //         },
  //         {
  //           type: 'text',
  //           content: '外观是一个绿色包装，很大一罐，比较实用。一打开就能闻到一股清香味。最吸引我的就是这个啦。里面是浅绿色膏体，中间夹杂着红色颗粒，一看就很吸引人。这款清洁霜是一个韩国进口的清洁霜，外包装标识着韩文，后面写有配方等等，是一个圆罐罐，打开能看到有个外盖上面放了一个小勺子。提示一下：用霜一类的都不能直接用手取量哦。',
  //           fontSize: 12,
  //           lineHeight: 18,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 630,
  //           left: 50,
  //           width: 265,
  //           MaxLineNumber: 5,
  //           breakWord: true,
  //           bolder: true
  //         },
  //         {
  //           type: 'rectangle',
  //           x: 24,
  //           y: 720,
  //           w: 5,
  //           h: 16,
  //           r: 0,
  //         },
  //         {
  //           type: 'text',
  //           content: '消费者',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 723,
  //           left: 34
  //         },
  //         {
  //           type: 'text',
  //           content: '外观是一个绿色包装，很大一罐，比较实用。一打开就能闻到一股清香味。最吸引我的就是这个啦。里面是浅绿色膏体，中间夹杂着红色颗粒，一看就很吸引人。这款清洁霜是一个韩国进口的清洁霜，外包装标识着韩文，后面写有配方等等，是一个圆罐罐，打开能看到有个外盖上面放了一个小勺子。提示一下：用霜一类的都不能直接用手取量哦。',
  //           fontSize: 12,
  //           lineHeight: 18,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 750,
  //           left: 50,
  //           width: 265,
  //           MaxLineNumber: 5,
  //           breakWord: true,
  //           bolder: true
  //         },
  //         {
  //           type: 'img',
  //           url: 'https://www.izhuangsha.com/wx_images/upload/tmp_17e35353f5e75b7903a15b8cbf497f06.jpg',
  //           top: 850,
  //           left: 38,
  //           width: 90,
  //           height: 80
  //         },
  //         {
  //           type: 'img',
  //           url: 'https://www.izhuangsha.com/wx_images/upload/tmp_17e35353f5e75b7903a15b8cbf497f06.jpg',
  //           top: 850,
  //           left: 144,
  //           width: 90,
  //           height: 80
  //         },
  //         {
  //           type: 'img',
  //           url: 'https://www.izhuangsha.com/wx_images/upload/tmp_17e35353f5e75b7903a15b8cbf497f06.jpg',
  //           top: 850,
  //           left: 250,
  //           width: 90,
  //           height: 80
  //         },
  //         {
  //           type: 'line',
  //           startX: 24,
  //           startY: 955,
  //           endX: 350,
  //           endY: 955,
  //           style: '#CDCDCD',
  //           lineWidth: 2
  //         },
  //         {
  //           type: 'img',
  //           url: 'https://www.izhuangsha.com/wx_images/pic/20190606031330.jpg',
  //           top: 970,
  //           left: 130,
  //           width: 120,
  //           height: 120
  //         },
  //         {
  //           type: 'text',
  //           content: '长按识别二维码，扫码查看详情',
  //           fontSize: 14,
  //           color: '#666666',
  //           textAlign: 'left',
  //           top: 1100,
  //           left: 100
  //         },
  //         // {
  //         //   type: 'text',
  //         //   content: '正品MAC魅可口红礼盒生日唇膏小辣椒Chili西柚情人',
  //         //   fontSize: 16,
  //         //   lineHeight: 21,
  //         //   color: '#383549',
  //         //   textAlign: 'left',
  //         //   top: 336,
  //         //   left: 44,
  //         //   width: 287,
  //         //   MaxLineNumber: 2,
  //         //   breakWord: true,
  //         //   bolder: true
  //         // },
  //         // {
  //         //   type: 'text',
  //         //   content: '￥0.00',
  //         //   fontSize: 19,
  //         //   color: '#E62004',
  //         //   textAlign: 'left',
  //         //   top: 387,
  //         //   left: 44.5,
  //         //   bolder: true
  //         // },
  //         // {
  //         //   type: 'text',
  //         //   content: '原价:￥138.00',
  //         //   fontSize: 13,
  //         //   color: '#7E7E8B',
  //         //   textAlign: 'left',
  //         //   top: 391,
  //         //   left: 110,
  //         //   textDecoration: 'line-through'
  //         // },
  //         // {
  //         //   type: 'text',
  //         //   content: '长按识别图中二维码帮我砍个价呗~',
  //         //   fontSize: 14,
  //         //   color: '#383549',
  //         //   textAlign: 'left',
  //         //   top: 460,
  //         //   left: 165.5,
  //         //   lineHeight: 20,
  //         //   MaxLineNumber: 2,
  //         //   breakWord: true,
  //         //   width: 125
  //         // }
  //       ]
  //     }
  //   })
  // },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }


  }
})

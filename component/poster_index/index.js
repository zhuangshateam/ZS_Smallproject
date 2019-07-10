const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: { // 封面图片
      type: String,
      value: ''
    },
    avater: { // 头像
      type: String,
      value: ''
    },
    nickname: { // 昵称
      type: String,
      value: ''
    },
    productname: { // 标题
      type: String,
      value: ''
    },
    index: { // 使用指数
      type: String,
      value: ''
    },
    index1: { // 使用指数1
      type: String,
      value: ''
    },
    sex: { // 性别
      type: String,
      value: ''
    },
    pifu: { // 皮肤
      type: String,
      value: ''
    },
    age: { // 年龄
      type: String,
      value: ''
    },
    qizhi: { // 气质
      type: String,
      value: ''
    },
    tiyan: { // 使用体验
      type: String,
      value: ''
    },
    tuiguang: { // 产品推广
      type: String,
      value: ''
    },
    xiaofeizhe: { // 消费者
      type: String,
      value: ''
    },
    img1: { // 底部图片1
      type: String,
      value: ''
    },
    img2: { // 底部图片2
      type: String,
      value: ''
    },
    img3: { // 底部图片3
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: "",
    showpost: false,
    imgHeight: 0,
    productCode: "" //二维码
  },

  ready: function() {

  },
  preventTouchMove: function (e) {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function() {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var productImage = that.data.avater;
      if (productImage) {
        wx.downloadFile({
          url: productImage,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function(data) {
                that.getQrCode(productSrc, data);
              })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var productSrc = "";
                  that.getQrCode(productSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getQrCode(productSrc);
      }
    },

    //下载二维码
    getQrCode: function(productSrc, imgInfo = "") {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      var productCode = that.data.codeimg;
      var imgUrl = that.data.imgUrl;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function(res) {
            wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              wx.downloadFile({
                url: imgUrl,
                success: function (ress) {
                  wx.hideLoading();
                  if (res.statusCode === 200) {
                    var imgSrc = ress.tempFilePath;
                    that.sharePosteCanvas(productSrc, imgSrc, codeSrc, imgInfo);
                  } else {
                    wx.showToast({
                      title: '二维码下载失败！',
                      icon: 'none',
                      duration: 2000,
                      success: function () {
                        var codeSrc = "";
                        that.sharePosteCanvas(productSrc, imgSrc, codeSrc, imgInfo);
                      }
                    })
                  }
                }
              })
              //that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var codeSrc = "";
                  that.sharePosteCanvas(productSrc, codeSrc, imgInfo);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var codeSrc = "";
        that.sharePosteCanvas(productSrc, codeSrc);
      }
    },

    //canvas绘制分享海报
    sharePosteCanvas: function (avaterSrc, imgSrc, codeSrc, imgInfo) {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        var left = rect.left;
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);
        //封面图片
        if (imgSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }
          ctx.drawImage(imgSrc, 0, 0, width, imgheght ? imgheght : width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }
        //头像
        if (avaterSrc) {
          if (imgInfo) {
            var imgheght = parseFloat(imgInfo);
          }


          ctx.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
          ctx.strokeStyle = "#ffe200";
          ctx.clip(); //裁剪上面的圆形
          ctx.drawImage(avaterSrc, 136, 196, 100, 100); // 在刚刚裁剪的园上画图

          // ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
          // ctx.setFontSize(14);
          // ctx.setFillStyle('#fff');
          // ctx.setTextAlign('left');
        }
        //产品名称
        if (that.data.productname) {
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productname).substr(0, 25), CONTENT_ROW_LENGTH);
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          ctx.setFontSize(16);
          let contentHh = 22 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], 15, imgheght + 35 + contentHh * m);
          }
        }
        //nickname
        if (that.data.nickname) {
          ctx.setFillStyle('#F57509');
          ctx.setTextAlign('left');
          ctx.setFontSize(14);
          var nickname = that.data.nickname;
          // if (!isNaN(price1)) {
          //   // price = "¥" + that.data.price
          //   price1 = that.data.price1
          // }
          ctx.fillText(nickname, left - 15, imgheght + 80); //积分
        }

        //产品金额
        if (that.data.price || that.data.price == 0) {
          // const CONTENT_ROW_LENGTH1 = 20; // 正文 单行显示字符长度
          // let [contentLeng1, contentArray1, contentRows1]= that.textByteLength((that.data.price).substr(0, 20), CONTENT_ROW_LENGTH1)
          ctx.setFontSize(14);
          ctx.setFillStyle('#F57509');
          ctx.setTextAlign('left');
          var price = that.data.price;
          //let contentHh = 22 * 1;
          if (!isNaN(price)) {
            // price = "¥" + that.data.price
            price =that.data.price
          }
          // for (let l = 0; l < contentArray1.length; l++) {
          //   ctx.fillText(contentArray1[l], 15, imgheght + 95 + contentHh * l);
          // }
          ctx.fillText(price, left - 15, imgheght + 110); //电话
        }


        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, left + 185, imgheght + 10, width / 4, width / 4)
          ctx.setFontSize(10);
          ctx.setFillStyle('#000');
          ctx.fillText("微信扫码或长按保存图片", left + 165, imgheght + 110);
        }
      }).exec()
      setTimeout(function() {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册，赶紧晒一下吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    that.closePoste();
                    if (res.confirm) {}
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: res.errMsg,
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function(err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function(src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              var imgHeight = (res2.windowWidth * 0.85 / ratio) + 130;
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight - 130);
            }
          })
        }
      })
    }
  }
})
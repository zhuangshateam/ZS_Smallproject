/* global Component wx */

Component({
  properties: {
    painting: {
      type: Object,
      value: {view: []},
      observer (newVal, oldVal) {
        if (!this.data.isPainting) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            if (newVal && newVal.width && newVal.height) {
              this.setData({
                showCanvas: true,
                isPainting: true
              })
              this.readyPigment()
            }
          } else {
            if (newVal && newVal.mode !== 'same') {
              this.triggerEvent('getImage', {errMsg: 'canvasdrawer:samme params'})
            }
          }
        }
      }
    }
  },
  data: {
    showCanvas: false,

    width: 100,
    height: 100,

    index: 0,
    imageList: [],
    tempFileList: [],
    isPainting: false,
    img:[]
  },
  ctx: null,
  cache: {},
  ready () {
    wx.removeStorageSync('canvasdrawer_pic_cache')
    this.cache = wx.getStorageSync('canvasdrawer_pic_cache') || {}
    this.ctx = wx.createCanvasContext('canvasdrawer', this)
  },
  methods: {
    readyPigment () {
      const { width, height, views } = this.data.painting
      this.setData({
        width,
        height
      })

      const inter = setInterval(() => {
        if (this.ctx) {
          clearInterval(inter)
          this.ctx.clearActions()
          this.ctx.save()
          this.getImageList(views)
          this.downLoadImages(0)
        }
      }, 100)
    },
    getImageList (views) {
      const imageList = []
      for (let i = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          if (views[i].url == '' || views[i].url == null) {
          }
          else {
            imageList.push(views[i].url)
          }
        }
        if (views[i].type === 'image1') {
          imageList.push(views[i].url1)

        }
      }
      this.setData({
        imageList
      })
    },
    downLoadImages (index) {
      const { imageList, tempFileList } = this.data
      if (index < imageList.length) {
        // console.log(imageList[index])
        this.getImageInfo(imageList[index]).then(file => {
          tempFileList.push(file)
          this.setData({
            tempFileList
          })
          this.downLoadImages(index + 1)
        })
      } else {
        this.startPainting()
      }
    },
    startPainting () {
      wx.showLoading({
        title: '生成中...',
        mask: true
      })
      const { tempFileList, painting: { views } } = this.data
      this.ctx.clearRect(10, 10, 600, 1000)
      for (let i = 0, imageIndex = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          if (views[i].url == '' || views[i].url == null) {
          }
          else{
           this.drawImage({
             ...views[i],
             url: tempFileList[imageIndex]
           })
           imageIndex++
         }
        } else if (views[i].type === 'image1'){
          this.drawImage1({
            ...views[i],
            url1: tempFileList[imageIndex]
          })
          imageIndex++
        }
        // else if (views[i].type === 'img') {
        //   if (views[i].url == '' || views[i].url==null){

        //   }else{
        //     this.drawImage_IMG({
        //       ...views[i],
        //       url: views[i].url
        //     })
        //     imageIndex++
        //   }
          
          
        // }  
        else if (views[i].type === 'line') {
          this.toline(views[i])
        } 
        else if (views[i].type === 'rectangle') {
          this.toRectangle(views[i])
        } 
        // else if (views[i].type === 'image2') {
        //   if (views[i].url2 == 1) {
        //     var url = "https://www.izhuangsha.com/api/images/jifen/integral_1.png";
        //     this.drawImage2({
        //       ...views[i],
        //       url2: url
        //     })
        //   }
        //   if (views[i].url2 == 2) {
        //     var url = "https://www.izhuangsha.com/api/images/jifen/integral_2.png";
        //     wx.getImageInfo({
        //       src: url,
        //       success: function (res) {
        //         console.log(res.path) //打印图片的本地路径
        //       }
        //     })
        //     this.drawImage2({
        //       url2: url,
        //     })
        //   }
        //   if (views[i].url2 == 3) {
        //     var url = "https://www.izhuangsha.com/api/images/jifen/integral_3.png";
        //     wx.getImageInfo({
        //       src: url,
        //       success: function (res) {
        //         console.log(res.path) //打印图片的本地路径
        //       }
        //     })
        //     this.drawImage2({
        //       ...views[i],
        //       url2: url
        //     })
        //   }
        //   if (views[i].url2 == 4) {
        //     var url = "https://www.izhuangsha.com/api/images/jifen/integral_4.png";
        //     wx.getImageInfo({
        //       src: url,
        //       success: function (res) {
        //         console.log(res.path) //打印图片的本地路径
        //       }
        //     })
        //     this.drawImage2({
        //       ...views[i],
        //       url2: url
        //     })
        //   }
          
        //   if (views[i].url2 == 5) {
        //     var that=this;
        //     //console.log(views[i])
        //     //var url = "https://www.izhuangsha.com/api/images/jifen/integral_5.png";
        //     views[i].url2 = "https://www.izhuangsha.com/api/images/jifen/integral_5.png";
        //     this.drawImage2({
        //       ...views[i],
        //       url2: views[i].url2
        //     })
            
        //   }
          
        //   imageIndex++
        // } 
        else if (views[i].type === 'text') {
          if (!this.ctx.measureText) {
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。'
            })
            this.triggerEvent('getImage', {errMsg: 'canvasdrawer:version too low'})
            return
          } else {
            this.drawText(views[i])
          }
        } else if (views[i].type === 'rect') {
          this.drawRect(views[i])
        }
      }
      this.ctx.draw(false, () => {
        wx.showLoading({
          title: '生成中...',
          mask: true
        })
        wx.setStorageSync('canvasdrawer_pic_cache', this.cache)
        this.saveImageToLocal()
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 3000)
    },
    drawImage (params) {
      this.ctx.save()
      const { url, top = 0, left = 0, width = 0, height = 0, borderRadius = 0 } = params
      // if (borderRadius) {
      //   this.ctx.beginPath()
      //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
      //   this.ctx.clip()
      //   this.ctx.drawImage(url, left, top, width, height)
      // } else {
        
      this.ctx.drawImage(url, left, top, width, height)
      // }
      this.ctx.restore()
      
    },
    drawImage1(params) {
      this.ctx.save()
      const { url1, top = 0, left = 0, width = 0, height = 0, borderRadius = 0 } = params
      //绘制头像
      this.ctx.save();
      this.ctx.beginPath();
      let r = 35;
      let d = r * 2;
      let cx = left;
      let cy = top;
      this.ctx.setLineWidth(4);
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
      this.ctx.closePath();
      this.ctx.clip();
      this.ctx.drawImage(url1, cx, cy, d, d);
      this.ctx.restore();
    },
    // drawImage_IMG(params){
    //   this.ctx.save()
    //   const { url, top = 0, left = 0, width = 0, height = 0, borderRadius = 0 } = params
    //   this.ctx.drawImage(url, left, top, width, height)
    //   this.ctx.restore()
    // },
    // drawImage2(params) {
    //   this.ctx.save()
    //   const { url2, top = 0, left = 0, width = 0, height = 0, borderRadius = 0 } = params
    //   this.ctx.drawImage(url2, left, top, width, height)
    //   this.ctx.restore()
    // },
    toline(params) {
      this.ctx.save()
      const { startX, startY, endX, endY, style, lineWidth} = params
      //设置线条粗细
      this.ctx.setLineWidth(lineWidth);
      this.ctx.strokeStyle = style;
      //设置直线的起点
      this.ctx.lineTo(startX, startY)
      //设置直线的终点
      this.ctx.lineTo(endX, endY)
      //设置描边，记住画直线一定要设置描边，否则没有图像
      this.ctx.stroke()
    },
    toRectangle(params){
      this.ctx.save()
      const { x, y, w, h, r } = params
      this.ctx.setFillStyle("#d8497c");
      this.ctx.setLineJoin('round');  //交点设置成圆角
      this.ctx.setLineWidth(r);
      this.ctx.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
      this.ctx.fillRect(x + r, y + r, w - r * 2, h - r * 2);
      this.ctx.stroke();
    },
    drawText (params) {
      this.ctx.save()
      const {
        MaxLineNumber = 2,
        breakWord = false,
        color = 'black',
        content = '', 
        fontSize = 16,
        top = 0,
        left = 0,
        lineHeight = 20,
        textAlign = 'left',
        width,
        bolder = false,
        textDecoration = 'none'
      } = params
      
      this.ctx.beginPath()
      this.ctx.setTextBaseline('top')
      this.ctx.setTextAlign(textAlign)
      this.ctx.setFillStyle(color)
      this.ctx.setFontSize(fontSize)

      if (!breakWord) {
        this.ctx.fillText(content, left, top)
        this.drawTextLine(left, top, textDecoration, color, fontSize, content)
      } else {
        let fillText = ''
        let fillTop = top
        let lineNum = 1
        for (let i = 0; i < content.length; i++) {
          fillText += [content[i]]
          if (this.ctx.measureText(fillText).width > width) {
            if (lineNum === MaxLineNumber) {
              if (i !== content.length) {
                fillText = fillText.substring(0, fillText.length - 1) + '...'
                this.ctx.fillText(fillText, left, fillTop)
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                fillText = ''
                break
              }
            }
            this.ctx.fillText(fillText, left, fillTop)
            this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            fillText = ''
            fillTop += lineHeight
            lineNum ++
          }
        }
        this.ctx.fillText(fillText, left, fillTop)
        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
      }
      
      this.ctx.restore()

      if (bolder) {
        this.drawText({
          ...params,
          left: left + 0.3,
          top: top + 0.3,
          bolder: false,
          textDecoration: 'none' 
        })
      }
    },
    drawTextLine (left, top, textDecoration, color, fontSize, content) {
      if (textDecoration === 'underline') {
        this.drawRect({
          background: color,
          top: top + fontSize * 1.2,
          left: left - 1,
          width: this.ctx.measureText(content).width + 3,
          height: 1
        })
      } else if (textDecoration === 'line-through') {
        this.drawRect({
          background: color,
          top: top + fontSize * 0.6,
          left: left - 1,
          width: this.ctx.measureText(content).width + 3,
          height: 1
        })
      }
    },
    drawRect (params) {
      this.ctx.save()
      const { background, top = 0, left = 0, width = 0, height = 0 } = params
      this.ctx.setFillStyle(background)
      this.ctx.fillRect(left, top, width, height)
      this.ctx.restore()
    },
    getImageInfo (url) {
      wx.showLoading({
        title: '生成中...',
        mask: true
      })
      return new Promise((resolve, reject) => {
        if (this.cache[url]) {
          resolve(this.cache[url])
        } else {
          const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: res => {
                if (res.errMsg === 'getImageInfo:ok') {
                  this.cache[url] = res.path
                  resolve(res.path)
                } else {
                  this.triggerEvent('getImage', {errMsg: 'canvasdrawer:download fail'})
                  reject(new Error('getImageInfo fail'))
                }
              }
            })
          } else {
            this.cache[url] = url
            resolve(url)
          }
        }
      })
    },
    saveImageToLocal () {
      wx.showLoading({
        title: '生成中...',
        mask: true
      })
      const { width, height } = this.data
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width,
          height,
          canvasId: 'canvasdrawer',
          complete: res => {
            if (res.errMsg === 'canvasToTempFilePath:ok') {
              this.setData({
                showCanvas: false,
                isPainting: false,
                imageList: [],
                tempFileList: [],
              })
              this.triggerEvent('getImage', {tempFilePath: res.tempFilePath, errMsg: 'canvasdrawer:ok'})
            } else {
              this.triggerEvent('getImage', {errMsg: 'canvasdrawer:fail'})
            }
          }
        }, this)
      }, 1000)
    }
  }
})

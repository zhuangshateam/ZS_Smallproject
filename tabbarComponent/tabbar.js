// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#D8497C",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "icon/icon_home.png",
            "selectedIconPath": "icon/icon_home_HL.png",
            "text": "首页"
          },
          {
            "pagePath": "pages/curriculum/curriculum",
            "text": "课程",
            "iconPath": "images/tabBar/tab_curriculum_gray.png",
            "selectedIconPath": "images/tabBar/tab_curriculum_gray.png"
          },
          {
            "pagePath": "/pages/comments/comments",
            "iconPath": "icon/icon_release.png",
            "isSpecial": true,
            "text": "发布"
          },
          {
            "pagePath": "pages/welfare/welfare",
            "text": "福利",
            "iconPath": "images/tabBar/tabBar_c_welfare.png",
            "selectedIconPath": "images/tabBar/tabBar_welfare.png"
          },
          {
            "pagePath": "/pages/home/home",
            "iconPath": "icon/icon_mine.png",
            "selectedIconPath": "icon/icon_mine_HL.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
    isPopping: false,//是否已经弹出  
    animPlus: {},//旋转动画  
    animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击弹出  
    plus: function () {
      if (!this.data.isPopping) {
        //弹出动画  
        this.popp(); 
        // this.setData({
        //   isPopping: true
        // })
      } else if (this.data.isPopping) {
        //缩回动画  
        this.takeback();
        // this.setData({
        //   isPopping: false
        // })
      }
    },
    forumAdd: function () {//去匿名讨论添加内容
      wx.navigateTo({
        url: '/pages/forumAdd/forumAdd'
      });
      this.takeback();
      
    },
    experienceAdd: function () {//去BA体验添加内容
      wx.navigateTo({
        url: '/pages/experienceAdd/experienceAdd'
      });
      this.takeback();
    },
    empiricalAdd: function () {//去BA经验添加内容
      wx.navigateTo({
        url: '/pages/empiricalAdd/empiricalAdd'
      })
      this.takeback();
    },

    //弹出动画  
    popp: function () {
      //plus顺时针旋转  
      var animationPlus = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationcollect = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationTranspond = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationInput = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationPlus.rotateZ(135).step();
      animationcollect.translate(-70, -40).rotateZ(360).opacity(1).step();//BA经验
      animationTranspond.translate(0,-70).rotateZ(360).opacity(1).step();//BA体验
      animationInput.translate(70, -40).rotateZ(360).opacity(1).step();//匿名
      this.setData({
        animPlus: animationPlus.export(),
        animCollect: animationcollect.export(),
        animTranspond: animationTranspond.export(),
        animInput: animationInput.export(),
        isPopping: true
      })
    },
    //收回动画  
    takeback: function () {
      //plus逆时针旋转  
      var animationPlus = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationcollect = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationTranspond = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationInput = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationPlus.rotateZ(0).step();
      animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
      animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
      animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
      this.setData({
        animPlus: animationPlus.export(),
        animCollect: animationcollect.export(),
        animTranspond: animationTranspond.export(),
        animInput: animationInput.export(),
        isPopping: false
      })
    },
  },
  

})



// pages/my/my.js
//获取应用实例
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({
    data: {
        userInfo: [{
          'userImg': '',
          'wx_name': ''
        }],
        showView: false,
        list:[
           {
               pic:'https://qncdn.playonwechat.com/shangcheng/fu.png',
               title:'待付款',
               status: "payment",
               num:'0'
           },
           {
               pic: 'https://qncdn.playonwechat.com/shangcheng/fa.png',
               title: '待发货',
               status: "deliver",
               num: '0'
           },
           {
               pic: 'https://qncdn.playonwechat.com/shangcheng/shou.png',
               title: '待收款',
               status: "receipt",
               num: '0'
           },
           {
               pic: 'https://qncdn.playonwechat.com/shangcheng/finish.png',
               title: '已完成',
               status: "finish",
               num: '0'
           }

        ]
    },
    onLoad: function (options) {
      var sign = wx.getStorageSync('sign');
      console.log("mid", options.mid);
      // 生命周期函数--监听页面加载  
      showView: (options.showView == "false" ? true : false)
    },
    // 分享
    fenxiang: function(){
      var that = this;
      that.setData({
        showView: (!that.data.showView)
      })  
    },
    onChangeShowState: function () {
      var that = this;
      that.setData({
        showView: (!that.data.showView)
      })
    },  
    // 优惠券
    coupon: function () {
      wx.navigateTo({
        url: '../coupon/coupon'
      })
    },
    // balance(){
    //   wx.navigateTo({
    //     url: '../chongzhi/chongzhi'
    //   })
    // },
    //推荐有奖
    tuijian:function(){
      wx.navigateTo({
        url: '../tuijian/tuijian'
      })
    },
    //会员中心
    userinform:function(){
      wx.navigateTo({
        url: '../invitation/invitation'
      })
    },
    work(){
      wx.navigateTo({
        url: '../workList/workList'
      })
    },
    // 提现
    tixian(){
      wx.navigateTo({
        url: '../tixian/tixian'
      })
    },
    onShow: function () {
      wx.hideShareMenu();
      var sign = wx.getStorageSync('sign');
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      var that = this;
      var signData = wx.getStorageSync("loginData");
      
      var avatarUrl = wx.getStorageSync("avatarUrl");
      var nickName = wx.getStorageSync("nickName");
      var mobile = wx.getStorageSync("mobile");
      console.log(avatarUrl);
      console.log(nickName);
      console.log(avatarUrl);
      var userInfo = {
        userImg: avatarUrl,
        nickName: nickName
      };
      that.setData({
        userInfo: userInfo
      })
      // 页面显示
      wx.getSetting({
        success(res) {
          if (!res['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success(res) {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                  console.log(res);
              },
              fail: function () {
                wx.openSetting({
                  success: (res) => {
                    console.log(res);
                    /*
                     * res.authSetting = {
                     *   "scope.userInfo": true,
                     *   "scope.userLocation": true
                     * }
                     */
                  }
                })
              }
            })
          }
        }
      })
      var sign = wx.getStorageSync("sign");
      wx.request({
        url: app.data.apiUrl+'/api/mine?sign=' + sign,
        success:function(res){
          console.log("mine",res);
          if(res.data.status){
            var mine = res.data.data;
            var list = that.data.list; //my各订单展示数目
            var identity = mine.identity; //identity 0为普通用户 1为员工 2为达人
                wx.setStorageSync("identity", mine.identity);
            list[0].num = mine.countPayment;
            list[1].num = mine.countDeliver;
            list[2].num = mine.countReceipt;
            list[3].num = mine.countFinish;
            //console.log(list);
            //wx.setStorageSync("coupon_info", mine.coupon_info);
            that.setData({
              list: list,
              countCarts: mine.countCarts,
              service: mine.service,
              //coupon_info: mine.coupon_info,
              identity: mine.identity
            })
          }
          wx.hideLoading()
        }
      }),
      wx.request({
        url: app.data.apiUrl2 + "/bargain/my-wallet?sign=" + sign,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          let status = res.data.status;
          if (status == 1) {
            console.log("余额", res.data.data);
            that.setData({
              money: res.data.data
            })
          } else {
            tips.alert(res.data.msg);
          }
          wx.hideLoading()
        }
      })
    },
    makePhone:function(e){
      var phone = e.target.dataset.phone;
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    
    dingdan:function(){
        wx.navigateTo({
          url: "../dingdan/dingdan?status="
        })
    },
    shoucang:function(){
        console.log('shoucang');
        wx.navigateTo({
          url: '../shoucang/shoucang'
        })
    },
    // 生成二维码
    erwei: function () {
      var sign = wx.getStorageSync("sign");
      wx.request({
        url: app.data.apiUrl+'/api/create-qrcode?sign=' + sign,
        success: function (res) {
          console.log("二维码", res);
          if (res.data.status) {
            var url = res.data.url;
            wx.previewImage({
              current: url, // 当前显示图片的http链接
              urls: [url] // 需要预览的图片http链接列表
            })
          }
        }
      })
    }
    
})

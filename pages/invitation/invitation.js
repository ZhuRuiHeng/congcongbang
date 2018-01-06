// pages/invitation/invitation.js
var sign = wx.getStorageSync('sign');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [
        {
          pic: '../images/tixian.png',
          title: '成功提现佣金',
          status: "payment",
          sum: '0',
          text:'元'
        },
        {
          pic: '../images/yongjin.png',
          title: '累计佣金',
          status: "deliver",
          sum: '0',
          text: '元'
        },
        {
          pic: '../images/haoyou.png',
          title: ' 我的好友',
          status: "receipt",
          sum: '0',
          text: '人'
        }
    ], 
    userInfo: [{
      'userImg': '',
      'wx_name': ''
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(nickName);
    console.log(avatarUrl);
    var userInfo = {
      userImg: avatarUrl,
      nickName: nickName
    };
    that.setData({
      userInfo: userInfo
    });
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
      });
      wx.request({
        url: app.data.apiUrl+"/api/member-center?sign=" + sign,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:',res)
          var memberInfo = res.data.data.memberInfo;
          var list = that.data.list; //列表
          list[0].sum = memberInfo.withdraw_fee;
          list[1].sum = Number(memberInfo.withdraw_fee) + Number(memberInfo.wallet);
          list[2].sum = memberInfo.friends;

          that.setData({
              list            : list,
              countCommission : memberInfo.countCommission,
              friends         : memberInfo.friends,
              inviter         : memberInfo.inviter,
              wallet          : memberInfo.wallet,
              withdraw_fee    : memberInfo.withdraw_fee
          })
          wx.hideLoading()
        }
      })
    
  },
  //好友列表
  userinform2: function () {
    wx.navigateTo({
      url: "../friends/friends"
    })
  },
  //明细
  mingxi:function(){
    wx.navigateTo({
      url: "../mingxi/mingxi"
    })
  }
})
// pages/friends/friends.js
var sign = wx.getStorageSync('sign');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList : [],
    active : 0,
    navList: false,
    page: 1,
    order:'',
    level:'one'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var identity = wx.getStorageSync('identity');
    console.log("identity:", identity);
    that.setData({
      identity: identity //identity 0为普通用户 1为员工 2为达人
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
    var that = this;
    wx.request({
      url: app.data.apiUrl + "/api/friend-list?sign=" + wx.getStorageSync('sign') ,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:',res)
          var friendList = res.data.data.friendList;

          that.setData({
             friendList: friendList
          })
          wx.hideLoading()
        }
    })
  },
  // 切换
  tapKeyWorld: function (e) {
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      var order = e.currentTarget.dataset.order;
      var level = e.currentTarget.dataset.level;
      var active = e.currentTarget.dataset.active;
      //console.log(level);
      that.setData({
        level: level,
        active: active
      })
      wx.request({
        url: app.data.apiUrl + "/api/friend-list?sign=" + wx.getStorageSync('sign') ,
        data:{
          level: level
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:', res)
          var friendList = res.data.data.friendList;

          that.setData({
            friendList: friendList
          })
          wx.hideLoading()
        }
      })
  },

  screen:function(e){
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      var order = e.currentTarget.dataset.order;
      //console.log('order：', order, 'level：', that.data.level);
      wx.request({
        url: app.data.apiUrl + "/api/friend-list?sign=" + wx.getStorageSync('sign') ,
        data: {
          level: that.data.level,
          order: order
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:', res);
          var friendList = res.data.data.friendList;

          that.setData({
            friendList: friendList,
            navList: false, //下拉列表
          })
          wx.hideLoading()
        }
      })
  },
  navList:function(){
    var that = this;
    var _navList = that.data.navList;
    that.setData({
      navList: !_navList
    })
  },
 
  // 下拉分页
  onReachBottom: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log("下拉分页")
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var that = this;
    var oldfriendList = that.data.friendList;
    console.log("oldfriendList:" + oldfriendList);
    var friendList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log(that.data.page);
    wx.request({
      url: app.data.apiUrl + "/api/friend-list?sign=" + wx.getStorageSync('sign') ,
      data: {
        level: that.data.level,
        order: that.data.order,
        page :  reqPage
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('新res', res);
        var friendList = res.data.data.friendList;
        if (res.data.data.length == 0) return;
        var page = oldPage + 1;
        var newfriendList = oldfriendList.concat(friendList);
        that.setData({
          friendList: newfriendList,
          page: reqPage
        });
        wx.hideLoading();
        if (newfriendList == undefined) {
          wx.showToast({
            title: '没有更多数据',
            duration: 800
          })
        }
        console.log("newfriendList:" + that.data.newfriendList);

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
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
  
  }

})
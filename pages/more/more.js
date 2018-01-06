//获取应用实例  
// pages/inform/inform.js
var list = [], that, data, listadd;
// var common = require('../../common.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
var main_content = []; 
Page({
    data: {
      cate_id:'',
      page: 1
    },
    onLoad: function (options) {
      var sign = wx.getStorageSync('sign');
      console.log(options);
      this.setData({
        cate_id: options.cate_id
      })
    },
 
    onShow: function () {
        // 页面初始化 options为页面跳转所带来的参数
      var sign = wx.getStorageSync('sign');
        wx.showToast({
            title: '加载中',
            icon: 'loading'
        })
        that = this;//在请求数据时setData使用
        console.log("cate_id",that.data.cate_id);
        console.log(app.data.apiUrl+'/api/goods-list?sign=' + sign )
        wx.request({
          url: app.data.apiUrl+'/api/goods-list?sign=' + sign,
          data: {
            cate_id: that.data.cate_id,
            limit: 10
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("知识列表", res)
            // 获取用户名称及发表时间
            var goodsList = res.data.data.goodsList;
            that.setData({
              main_content: goodsList
            })
            wx.hideLoading()
          }
        });
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
      var oldGoodsList= that.data.main_content;
      console.log("oldGoodsList:" + oldGoodsList);
      var goodsList = [];
      var oldPage = that.data.page;
      var reqPage = oldPage + 1;
      console.log(that.data.page);
      wx.request({
        url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign'),
        data: {
          page: reqPage,
          cate_id: that.data.cate_id,
          limit: 10
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('新res',res);
          var goodsList = res.data.data.goodsList;
          if (res.data.data.length == 0) return;
          var page = oldPage + 1;
          var newContent = oldGoodsList.concat(goodsList);
          
          that.setData({
            main_content: newContent,
            page: reqPage
          });
          wx.hideLoading();
          if (newContent == undefined) {
            wx.showToast({
              title: '没有更多数据',
              duration: 800
            })
          }
          console.log("newContent:" + that.data.newContent);
         
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
    }
}) 

//时间戳转换为时间
function timeString(time) {
    var newDate = new Date();
    newDate.setTime(time);
    var result = newDate.toLocaleDateString();
    return result;
}

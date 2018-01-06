// pages/pintuan/pintuan.js
var list = [], that, data, listadd, page = 1;
var sign = wx.getStorageSync('sign');
// var common = require('../../common.js');
var app = getApp();
var main_content = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_word: [],
    page: 1
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    console.log(options);
    this.setData({
      cate_id: options.gid
    })
  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var that = this;
    var search_word = [];
    for (var i = 0; i < that.data.search_word.length; i++) {
      search_word.push(that.data.search_word[i]);
    }
    var width = 130 * that.data.search_word.length + 2;
    console.log('width:', width);
    that.setData({
      search_word: search_word,
      w_width: width
    });
    // 导航
    wx.request({
      url: app.data.apiUrl+'/api/get-category?sign=' + sign  + '&type=true',
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("导航列表", res);
        var search_word = res.data.categorys;
        console.log("search_word:", search_word);
        var len = search_word.length + 2;
        var width = 130 * len;
        console.log("width", width);
        that.setData({
          search_word: search_word,
          w_width: width
        })
        wx.hideLoading()
      }
    });
    // 分类下数据
    setTimeout(function(){
      console.log(that.data.search_word);
      wx.request({
        url: app.data.apiUrl+'/api/fight-group-list?sign=' + sign ,
        data: {
          cate_id: that.data.search_word[0].cate_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("团购列表", res)
          console.log(res.data.data.fightGroupList);
          that.setData({
            main_content: res.data.data.fightGroupList
          })
          wx.hideLoading()
        }
      });
    },500)
    


  },
  // 点击切换
  tapKeyWorld: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var ontap = e.currentTarget.dataset.ontap;
    var search_word = that.data.search_word;
    that.setData({
      cate_id: ontap
    })
    setTimeout(function () {

      for (var i = 0; i < search_word.length; i++) {
        search_word[i].active = false;
        if (ontap == search_word[i].cate_id) {
          search_word[i].active = true;
        }
      }
      that.setData({
        search_word: search_word
      })
      wx.request({
        url: app.data.apiUrl+"/api/fight-group-list?sign=" + sign ,
        data: {
          cate_id: that.data.cate_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("切换数据", res);
          // 此处清空全局的数据
          var main_content = "";
          that.setData({
            main_content: res.data.data.fightGroupList
          })
          wx.hideLoading()
        }
      })
    }, 300)
  },

  //下拉分页
  onReachBottom: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log("下拉......");
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var that = this;
    var oldGoodsList = that.data.main_content;
    var goodsList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log('page:', reqPage)
    wx.request({
      url: app.data.apiUrl + "/api/fight-group-list?sign=" + wx.getStorageSync('sign') ,
      data: {
        page: reqPage,
        cate_id: that.data.cate_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('新res', res);
        var goodsList = res.data.data.fightGroupList;
        if (res.data.data.length == 0) return;
        var page = oldPage + 1;
        // 获取用户名称及发表时间
        that.setData({
          page: reqPage
        });
        // var contentTip = res.data.data.goodsList;
        var newContent = oldGoodsList.concat(goodsList);
        that.setData({
          main_content: newContent
        });
        wx.hideLoading();
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


})
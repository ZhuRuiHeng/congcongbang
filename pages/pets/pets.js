//index.js
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
//获取应用实例
main_content: [];//最新最热
main_content2: [];//列表
modules: [];//模板
var app = getApp();
///////////////
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    page: 1,
    screenList:false,
    price_sort:'',
    sort:'',
    out:'',
    sort1: [
              { 
                id:'1',
                name: '2000元以下'
              },
              {
                id: '2',
                name: '2000元-5000元'
              },
              {
                id: '3',
                name: '5000元-10000元'
              },
              {
                id: '4',
                name: '10000元以上'
              }
          ],
    sort2: [
              {
                id: 'recommend',
                name: '推荐'
              }, {
                id: 'new',
                name: '最新'
              }, {
                id: 'hprice',
                name: '价格升序'
              },{
                id: 'lprice',
                name: '价格降序'
              }
          ],
    sort3:[
          {
            id: 'recommend',
            name: '狗狗'
          }, {
            id: 'new',
            name: '猫猫'
          }, {
            id: 'hprice',
            name: '其他'
          }
        ]
  },
  onShow: function () {
    console.log('onshow');
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    wx.request({
      url: app.data.apiUrl2 + '/api/goods-list?sign=' + wx.getStorageSync('sign'),
      data:{
        task_flag: true,
        limit: 10,
        order:''
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("宠物列表", res)
        // 获取用户名称及发表时间
        var goodsList = res.data.data.goodsList;
        that.setData({
          main_content: goodsList
        })
        wx.hideLoading()
      }
    });
  },
  // 筛选列表
  navItem(e){
    console.log(e);
    let that = this;
    let name = e.currentTarget.dataset.name;
    console.log('name:', name);
    console.log('type:', e.currentTarget.dataset.type);
    that.setData({
      type: e.currentTarget.dataset.type
    })
    if (name == 'price'){
        that.setData({
          screenList: that.data.sort1
        })
    } else if (name == 'sort'){
        that.setData({
          screenList: that.data.sort2
        })
    } else if (name == 'out'){
      that.setData({
        screenList: that.data.sort3
      })
    }
  },
  // 筛选
  posterItem(e){
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    let type = that.data.type;
    console.log("type:",type);
    that.setData({
      screenList:false
    })
    if(type == 'sort'){
      console.log(type,1111);
      wx.request({
        url: app.data.apiUrl2 + '/api/goods-list?sign=' + wx.getStorageSync('sign'),
        data: {
          task_flag: true,
          limit: 10,
          sort: id,
          order: ''
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("宠物列表", res);
          var status = res.data.status;
          if (status==1){
            var goodsList = res.data.data.goodsList;
            that.setData({
              main_content: goodsList
            })
            wx.hideLoading()
          }else{
            that.showZanToast(res.data.msg);
          }
         }
      });
    }else if(type == 'price_sort'){
      console.log(type,2222);
      wx.request({
        url: app.data.apiUrl2 + '/api/goods-list?sign=' + wx.getStorageSync('sign'),
        data: {
          task_flag: true,
          price_sort: id,
          limit: 10,
          order: ''
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var goodsList = res.data.data.goodsList;
            that.setData({
              main_content: goodsList
            })
            wx.hideLoading()
          } else {
            that.showZanToast(res.data.msg);
          }
        }
      });
    } else if (type == 'price_out'){
      wx.request({
        url: app.data.apiUrl2 + '/api/goods-list?sign=' + wx.getStorageSync('sign'),
        data: {
          task_flag: true,
          price_sort: id,
          limit: 10,
          order: ''
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var goodsList = res.data.data.goodsList;
            that.setData({
              main_content: goodsList
            })
            wx.hideLoading()
          } else {
            that.showZanToast(res.data.msg);
          }
        }
      });
    }
    



  },
  // 取消
  cancel() {
    this.setData({
      screenList: false
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
    var oldGoodsList = that.data.main_content;
    console.log("oldGoodsList:" + oldGoodsList);
    var goodsList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log(that.data.page);
    wx.request({
      url: app.data.apiUrl2 + '/api/goods-list?sign=' + wx.getStorageSync('sign'),
      data: {
        page: reqPage,
        limit: 20,
        task_flag:true,
        sort: that.data.sort,
        price_sort: that.data.price_sort
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('新res', res);
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

}))
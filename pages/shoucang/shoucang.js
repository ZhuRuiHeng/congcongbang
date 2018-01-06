//获取应用实例  
// pages/inform/inform.js
var list = [], that, data, listadd;
var sign = wx.getStorageSync('sign');
// var common = require('../../common.js');
var app = getApp();
var main_content = [];
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    cate_id: '',
    page: 0,  //分页
    addCar: false,//打开购物车
    closeCar: true,//关闭购物车
    price: 1,//购物车数量
    minusStatus: 'disabled',//数量为1禁用
    sum: '',//购物车id
    _num: "", //类型型号
    state: 0,
    cate: 0,
    arr: [],
    attrLen: '', //长度
    values: [], //型号
    figure: '',
    i: 0
  },
  onLoad: function () {
    var sign = wx.getStorageSync('sign');
  },

  onShow: function () {
    var sign = wx.getStorageSync('sign');
    // 页面初始化 options为页面跳转所带来的参数
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    that = this;//在请求数据时setData使用
    wx.request({
      url: app.data.apiUrl+ '/api/my-collections?sign=' + sign ,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("收藏列表", res)
        // 获取用户名称及发表时间
        var goodsList = res.data.data.myCollections;
        that.setData({
          main_content: goodsList
        })
        wx.hideLoading()
      }
    });
  },
  guanguang:function(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  //购物车选择商品
  addCar: function (e) {
    var sign = wx.getStorageSync('sign');
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    // var inform = that.data.inform;    
    var gid = e.currentTarget.dataset.gid;

    // inform[gid]
    wx.setStorageSync("carid", gid);
    wx.setStorageSync("length", gid);
    console.log("carid", gid);
    that.setData({
      _gid: gid
    })
    wx.request({
      url: app.data.apiUrl+ "/api/goods-detail?sign=" + sign ,
      data: {
        gid: that.data._gid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("详情", res);
        var list = [];
        // 获取用户名称及发表时间
        var inform = res.data.data.goodsDetail;
        //inform.attribute
        that.setData({
          addCar: true,
          inform: inform,
          figure: inform.picture[0],
          low_price: inform.low_price,
          high_price: inform.high_price
        })
        wx.hideLoading()
        console.log("inform详情", inform);
      }
    })
  },
  closeCar: function (obj) {
    var id = obj.target.id;
    console.log(id);
    var that = this;
    that.setData({
      addCar: false,
      arr: [],
      values: []
    })
  },
  //  添加购物车
  addCars: function (e) {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var gid = that.data._gid;
    var attribute = "";
    var types = "";
    var arr = that.data.arr;
    var values = that.data.values;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        attribute += arr[i] + ',';
        types += values[i];
      }
    }
    // 截取最后一位字符
    attribute = attribute.substr(0, attribute.length - 1);
    console.log("aaaaaa", attribute);
    console.log("attribute", typeof attribute[0]);
    console.log("gid", gid);
    var num = that.data.price;
    console.log('gid', gid + 'num', num + 'attribute', attribute);
    wx.request({
      url: app.data.apiUrl+ "/api/add-carts?sign=" + sign ,
      method: "POST",
      data: {
        gid: that.data._gid,
        num: that.data.price,
        attribute: attribute
      },
      success: function (res) {
        console.log("post", res);
        var status = res.data.status;
        if (status == 1) {
          that.showZanToast('加入购物车成功');
          that.setData({
            addCar: false
          })
        } else {
          that.showZanToast('请选择属性');
        }
        that.setData({
          arr: [],
          values: [],
          price: 1
        })

      }
    })
    
  },
  buy: function (e) {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var attribute = "";
    var types = "";
    var arr = that.data.arr;
    var values = that.data.values;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        attribute += arr[i] + ',';
        types += values[i] + ' ';
      }
    }
    attribute = attribute.substr(0, attribute.length - 1);
    console.log("aaaaaa", attribute);
    console.log("types", types);
    var carid = wx.getStorageSync("carid");
    var attrLen = that.data.inform.attribute.length;//获取attribute长度
    var arrlen = that.data.arr.length; //数组长度
    console.log('获取attribute长度', attrLen);
    console.log('cccccc', that.data.price + 'aaaa' + that.data.low_price + 'types' + attribute); //bug 数组长度

    if (attrLen > 0) {
      if (arrlen == attrLen) {
        wx.navigateTo({
          url: '../dingdanInform/dingdanInform?gid=' + carid + '&price=' + that.data.price + '&attr=' + attribute + '&types=' + types + '&low_price=' + that.data.low_price
        })
        console.log(attribute);
      } else {
        that.showZanToast('请选择属性');
      }
    } else {
      wx.navigateTo({
        url: '../dingdanInform/dingdanInform?gid=' + carid + '&' + 'price=' + that.data.price + '&types=' + types + '&low_price=' + that.data.low_price
      })
    }
    that.setData({
      arr: [],
      values: [],
      addCar: false,
      price: 1
    })
  },
  leibieall: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    console.log("e", e)
    var anids = e.currentTarget.dataset.anid;
    this.setData({
      anids: anids,
      index: index
    });
    console.log("this.index", this.data.anids);
  },
  //选择型号
  xuanze: function (e) {
    var sign = wx.getStorageSync('sign');
    // console.log(e.currentTarget.dataset.index);
    var that = this;
    var arr = that.data.arr;
    var values = that.data.values;;
    var attribute = [];
    setTimeout(function () {
      var anids = that.data.anids;//
      var index = that.data.index;
      //console.log("index",index);
      var active2 = e.currentTarget.dataset.active; //状态
      var avid = e.target.dataset.avid;//值
      var value = e.target.dataset.value;//value
      //console.log("值", value);
      var _attribute = that.data.inform.attribute;
      var _inform = that.data.inform;
      // //////////////
      var attribute_value = _attribute[index].attribute_value;
      console.log("attribute_value", attribute_value);
      console.log(attribute_value.length);
      for (var j = 0; j < attribute_value.length; j++) {
        attribute_value[j].active = false;
        if (avid == attribute_value[j].avid) {
          attribute_value[j].active = true;
          console.log(attribute_value[j].active);
          var avid1 = attribute_value[j].avid;
          var figure = attribute_value[j].figure;
          if (figure != '') {
            figure = attribute_value[j].figure;
          } else {
            figure = that.data.figure;
          }


          console.log('figure:', attribute_value[j].figure);
          //setTimeout(function () {
          if (index == 0) {
            arr[0] = anids + ':' + avid;
            values[0] = value;
          } else if (index == 1) {
            arr[1] = anids + ':' + avid;
            values[1] = value;
          } else if (index == 2) {
            arr[2] = anids + ':' + avid;
            values[2] = value;
          }
          // }, 100)
        }
      }

      console.log('qqqqqqqqqqqq', arr);
      /////////////////
      console.log("参数", anids, avid, value);
      //////////////////////////////////////////////
      var attribute = "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          attribute += arr[i] + ',';
        }
      }

      attribute = attribute.substr(0, attribute.length - 1);
      console.log("111111111111111", attribute);
      var carid = wx.getStorageSync("carid");
      var attrLen = that.data.inform.attribute.length;//获取attribute长度
      var arrlen = that.data.arr.length; //数组长度
      console.log('获取attribute长度', attrLen);
      console.log('数组长度', arrlen); //bug 数组长度
      console.log('low_price:', that.data.inform.low_price);
      var priceGroup = that.data.inform.priceGroup;
      var s = 'attr' + attribute;
      console.log('sssss:', s);
      for (var i = 0; i < priceGroup.length; i++) {
        if (priceGroup[i].key == s) {
          console.log("iiiiii", i);
          var i = i;
          that.setData({
            i: i
          });
          var nowPrice = that.data.inform.priceGroup[that.data.i].price;
          console.log('nowPrice:', nowPrice);
          that.setData({
            inform: _inform,
            figure: figure,
            low_price: nowPrice,
            high_price: nowPrice
          })
        }
      }
      console.log(that.data.low_price + '低;高' + that.data.high_price)
      ///////////////////////////////////////////////


      that.setData({
        inform: _inform,
        figure: figure
      })
      ///////////////
      console.log("attribute111:", attribute);
      that.setData({
        _num: e.target.dataset.avid,
        attribute: attribute
      })
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    var price = this.data.price;
    if (price > 1) {
      price--;
    }
    var minusStatus = price <= 1 ? 'disabled' : 'normal';
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var price = this.data.price;
    price++;
    var minusStatus = price < 1 ? 'disabled' : 'normal';
    this.setData({
      price: price,
      minusStatus: minusStatus
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
    var oldGoodsList = that.data.main_content;
    console.log("oldGoodsList:" + oldGoodsList);
    var goodsList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    wx.request({
      url: app.data.apiUrl + "/api/my-collections?sign=" + wx.getStorageSync('sign') ,
      data: {
        page: reqPage
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('新res', res);
        var goodsList = res.data.data.myCollections;
        if (res.data.data.length == 0) return;
        var page = oldPage + 1;
        var newContent = oldGoodsList.concat(goodsList);

        that.setData({
          main_content: newContent,
          page: reqPage
        });
        wx.hideLoading()
        console.log("newContent:" + that.data.newContent)
      }, fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
  },
}))

//时间戳转换为时间
function timeString(time) {
  var newDate = new Date();
  newDate.setTime(time);
  var result = newDate.toLocaleDateString();
  return result;
}

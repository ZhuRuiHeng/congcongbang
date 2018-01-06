// pages/inform/inform.js
var common = require('../../common.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    addCar: false,//打开购物车
    addbuy: false,
    closeCar: false,//关闭购物车
    price: 1,//购物车数量
    minusStatus: 'disabled',//数量为1禁用
    sum: '',//购物车id
    _num: 1, //类型
    arr: [],
    attrLen: '',
    values: [], //型号
    shuxing: '',
    all: [],
    bar: false,
    daohang1: false,
    daohang: true,
    scrollTop: 0,
    floorstatus: false,
    share: false,
    is_membership: false,
    _is_membership: true
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    var kid = wx.getStorageSync("kid");
    console.log("signkid:", kid, sign);
    console.log("options", options);
    var sign = wx.getStorageSync('sign');
    var that = this;
    var gid = options.gid;//列表页传来的id
    var sharer_id = options.mid;//二维码传来的mid

    console.log("gidqqqqq", gid);
    wx.setStorageSync("gid", gid);
    wx.setStorageSync("sharer_id", sharer_id);
    this.setData({
      gid: gid,
      sharer_id: sharer_id,
    });
    console.log("sharer_id", that.data.sharer_id);
  },

  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var mid = wx.getStorageSync('mid');
    console.log('mid:', mid)
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    app.getAuth(function () {
      var sign = wx.getStorageSync('sign');
      var gid = that.data.gid;//列表页传来的id
      console.log('sign:', sign, 'kid:', app.data.kid);

      wx.request({
        url: app.data.apiUrl+"/api/goods-detail?sign=" + sign ,
        data: {
          gid: gid
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
          var picture = inform.picture;
          var informImg = inform.content;
          var is_membership = res.data.data.is_membership;
          that.setData({
            inform: inform,
            figure: inform.picture[0],
            low_price: inform.low_price,
            high_price: inform.high_price,
            informImg: informImg,
            imgUrls: picture,
            shuxing: inform.attribute,
            is_collect: inform.is_collect,
            is_membership: is_membership
          })
          var shuxing = that.data.shuxing;
          console.log("属性：", shuxing);
          var all = [];
          for (var i = 0; i < that.data.shuxing.length; i++) {
            var all = that.data.all;
            if (shuxing[i].attribute_name) {
              all[i] = shuxing[i].attribute_name + '   ';
              console.log(shuxing[i].attribute_name);
            }
          }
          // all = all.substr(0,all.length-1);
          console.log(all)

          that.setData({
            all: all
          })
          console.log("all:", that.data.all);
          console.log(typeof all);
          wx.hideLoading()
        }
      })
    })

  },
  //轮播图预览
  imgPreview: function () { //图片预览
    const imgs = this.data.imgUrls;
    console.log("const");
    wx.previewImage({
      current: imgs[this.data.currentIndex], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  // 跳转
  gouwuche: function () {
    wx.navigateTo({
      url: '../car/car'
    })
  },
  //分享
  share: function () {
    var that = this;
    that.setData({
      share: true
    })

  },
  // 导航
  daohang: function () {
    var that = this;
    that.setData({
      daohang1: true,
      daohang: false,
      bar: true
    })
    console.log('daohang');
  },
  guanbi: function () {
    var that = this;
    that.setData({
      daohang1: false,
      daohang: true,
      bar: false
    })
    console.log('guanbi');
  },
  backtop: function () {
    var that = this;
    console.log('backtop');
    that.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    // console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //跳转购物车
  gouwuche: function () {
    wx.switchTab({
      url: '../car/car'
    })
  },
  //购物车
  addCar: function (e) {
    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    var gid = e.currentTarget.dataset.gid;
    var sign = wx.getStorageSync("sign");
    console.log("gid", gid);
    that.setData({
      gid: gid
    })
    wx.request({
      url: app.data.apiUrl+"/api/goods-detail?sign=" + sign ,
      data: {
        gid: that.data.gid
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
        //infoem.attribute
        that.setData({
          addCar: true,
          inform: inform
        })
        wx.hideLoading()
        console.log("inform详情", inform);
      }
    })
  },
  //购买
  addbuy: function (e) {
    var sign = wx.getStorageSync('sign');
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    var gid = e.currentTarget.dataset.gid
    console.log("gid", gid);
    that.setData({
      gid: gid
    })
    wx.request({
      url: app.data.apiUrl+"/api/goods-detail?sign=" + sign ,
      data: {
        gid: that.data.gid
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
        //infoem.attribute
        that.setData({
          addbuy: true,
          inform: inform
        })
        wx.hideLoading()
      }
    })
  },
  tianjia: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var is_collect = that.data.is_collect;
    wx.request({
      url: app.data.apiUrl+"/api/collect-goods?sign=" + sign ,
      data: {
        gid: that.data.gid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("收藏：", res);
        var status = res.data.status;
        if (status == 1) {
          that.showZanToast('收藏成功!');
          that.setData({
            is_collect: 1
          })
        } else {
          wx.request({
            url: app.data.apiUrl+"/api/remove-collection?sign=" + sign ,
            data: {
              gid: that.data.gid
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              console.log("取消", res);
              that.showZanToast('取消收藏成功!');
              that.setData({
                is_collect: 0
              })
            }
          })
        }
      }
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
    // console.log(e.currentTarget.dataset.index);
    var that = this;
    var sign = wx.getStorageSync('sign');
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
      for (var j = 0; j < attribute_value.length; j++) {
        attribute_value[j].active = false;
        if (avid == attribute_value[j].avid) {
          attribute_value[j].active = true;
          console.log('attribute_value[j].attribute_valu:', attribute_value[j].attribute_value);
          var avid1 = attribute_value[j].avid;
          var figure = attribute_value[j].figure;
          if (figure != '') {
            figure = attribute_value[j].figure;
          } else {
            figure = that.data.figure;
          }
          //属性
          var shuxings = [];
          if (attribute_value[j].attribute_value) {
            shuxings += attribute_value[j].attribute_value + '  ';
          }

          //console.log('figure:', attribute_value[j].figure);
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
      that.setData({
        shuxings: shuxings
      })
      var attribute = "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          attribute += arr[i] + ',';
        }
      }
      console.log("arr:", arr);
      attribute = attribute.substr(0, attribute.length - 1);
      console.log("111111111111111", attribute);
      var carid = wx.getStorageSync("carid");
      var attrLen = that.data.inform.attribute.length;//获取attribute长度
      var arrlen = that.data.arr.length; //数组长度
      // console.log('获取attribute长度', attrLen);
      // console.log('数组长度', arrlen); //bug 数组长度
      // console.log('low_price:', that.data.inform.low_price);
      var priceGroup = that.data.inform.priceGroup;
      var s = 'attr' + attribute;
      console.log('sssss:', s);
      for (var i = 0; i < priceGroup.length; i++) {
        // console.log('|||||||||||', priceGroup[i].key);
        // console.log('\\\\\\\\\\',s);
        if (priceGroup[i].key == s) {
          console.log("iiiiii", i);
          var i = i;
          that.setData({
            i: i
          });
          var nowPrice = that.data.inform.priceGroup[that.data.i].price;
          console.log('nowPrice:', nowPrice);
          that.setData({
            all: values,
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
  closeCar: function (obj) {
    console.log('closeCar');
    var id = obj.target.id;
    console.log(id);
    var that = this;
    that.setData({
      addCar: false,
      addbuy: false,
      values: []
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    //console.log('-');
    var price = this.data.price;
    // 如果大于1时，才可以减 
    if (price > 1) {
      price--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = price <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    //console.log('+');
    var price = this.data.price;
    // 不作过多考虑自增1 
    price++;
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = price < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  //加入购物车
  addCars: function (e) {
    var that = this;
    sign = wx.getStorageSync('sign');
    var gid = that.data.gid;
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
    attribute = attribute.substr(0, attribute.length - 1);
    console.log("aaaaaa", attribute);

    console.log("attribute", typeof attribute[0]);
    console.log("gid", gid);
    var num = that.data.price;
    console.log('gid', gid + 'num', num + 'attribute', attribute);
    wx.request({
      url: app.data.apiUrl+"/api/add-carts?sign=" + sign ,
      method: "POST",
      data: {
        gid: that.data.gid,
        num: that.data.price,
        attribute: attribute
      },
      success: function (res) {
        console.log("post", res);
        var status = res.data.status;
        if (status == 1) {
          that.showZanToast('加入购物车成功');
          that.setData({
            arr: [],
            addCar: false,
            addbuy: false,
            price: 1,
            num: 1
          })
        } else {
          that.showZanToast('请选择属性');
          that.setData({
            arr: []
          })
        }


      }
    })
  },
  //下一步
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
    console.log('数组长度', arrlen); //bug 数组长度
    if (attrLen > 0) {
      if (arrlen == attrLen) {
        wx.navigateTo({
          url: '../dingdanInform/dingdanInform?gid=' + that.data.gid + '&price=' + that.data.price + '&attr=' + attribute + '&types=' + types + '&low_price=' + that.data.low_price + '&type=0'
        })
        console.log(attribute);
      } else {
        that.showZanToast('请选择属性');
      }
    } else {
      wx.navigateTo({
        url: '../dingdanInform/dingdanInform?gid=' + that.data.gid + '&' + 'price=' + that.data.price + '&low_price=' + that.data.low_price + '&type=0'
      })
    }
    that.setData({
      arr: [],
      values: [],
      addbuy: false,
      price: 1
    })
  },
  // 返回首页
  backHome: function () {
    common.backHome();
  },

  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 用户点击右上角分享
   */
  //设置分享
  onShareAppMessage: function () {
    var that = this;
    var mid = wx.getStorageSync('mid');
    console.log(mid)
    return {
      title: '宠宠邦',
      path: '/pages/inform/inform?gid=' + that.data.gid + '&mid=' + mid,
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
}))
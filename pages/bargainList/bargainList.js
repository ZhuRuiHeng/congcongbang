//index.js
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js'
//获取应用实例
main_content: [];//最新最热
main_content2: [];//列表
modules: [];//模板
var app = getApp();
///////////////
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    lunbo: [],
    fightGroup: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
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
    i: 0,
    activity: true, //帮砍价库存问题
    bargain_id: '',//砍价id
    kanjia:true //可以砍价
  },
  // 获取索引默认加载引用
  suoyin: function (e) {
    var sign = wx.getStorageSync('sign');
    console.log("e", e)
    var allindex = e.currentTarget.dataset.allindex;
    this.setData({
      allindex: allindex,
    });
    console.log("this.index", this.data.allindex);
  },
  //购物车选择商品
  addCar: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var sign = wx.getStorageSync('sign');
    var that = this;
    var gid = e.currentTarget.dataset.gid;
    wx.setStorageSync("carid", gid);
    wx.setStorageSync("length", gid);
    console.log("carid", gid);
    that.setData({
      gid: gid
    })
    wx.request({
      url: app.data.apiUrl + "/api/goods-detail?sign=" + wx.getStorageSync('sign'),
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
    console.log("e:",e)
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
    var num = that.data.price;
    console.log('gid', gid + 'num', num + 'attribute', attribute);
    wx.request({
      url: app.data.apiUrl + "/api/add-carts?sign=" + wx.getStorageSync('sign'),
      method: "POST",
      data: {
        gid: that.data._gid,
        num: that.data.price,
        attribute: attribute
      },
      success: function (res) {
        //console.log("post", res);
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
  // 已有砍价bargain_id
  getBargain(e){
    console.log(e);
    let bargain_id = e.currentTarget.dataset.bargain_id;
    this.setData({
      bargain_id: e.currentTarget.dataset.bargain_id,
      gid:e.currentTarget.dataset.gid
    })
    if (bargain_id !=0){
      wx.navigateTo({
        url: '../bargainInform/bargainInform?bargain_id=' + bargain_id + '&gid=' + e.currentTarget.dataset.gid
      })
    }else{
      tips.alert('请点击发起砍价按钮')
    }
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
  // 发起砍价立即购买
  buy: function (e) {
    var that = this;
    let is_alive = e.currentTarget.dataset.is_alive;
    console.log("is_alive：",is_alive);
    if (is_alive==1){
        that.showZanToast('活体不能砍价');
        return;
    }
    var attribute = "";
    var types = "";
    var arr = that.data.arr;
    var values = that.data.values;
    console.log('bargain_id:', that.data.bargain_id);
    console.log("gid:",that.data.gid);
    that.setData({
      kanjia: false
    })
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        attribute += arr[i] + ',';
        types += values[i] + ' ';
      }
    }
    attribute = attribute.substr(0, attribute.length - 1);
    var carid = wx.getStorageSync("carid");
    var attrLen = that.data.inform.attribute.length;//获取attribute长度
    var arrlen = that.data.arr.length; //数组长度
    if (attrLen > 0) {  //有属性
      if (arrlen == attrLen) {
        that.setData({
          addCar: false
        })
        wx.request({
          url: app.data.apiUrl + "/bargain/create-bargain?sign=" + wx.getStorageSync("sign"),
          method: "GET",
          data: {
            goods_id: that.data.gid,
            attribute: attribute
          },
          success: function (res) {
            //console.log("post", res);
            var status = res.data.status;
            if (status == 1) {
              console.log('发起砍价成功',res.data.data);
              console.log('../bargainInform/bargainInform?bargain_id=' + res.data.data + '&gid=' + that.data.gid);
              wx.navigateTo({
                url: '../bargainInform/bargainInform?bargain_id=' + res.data.data + '&gid=' + that.data.gid
              })
            } else {
              that.showZanToast(res.data.msg);
            }
            that.setData({
              arr: [],
              values: [],
              price: 1,
              kanjia:true
            })

          }
        })
      } else {
        that.showZanToast('请选择属性');
      }
    } else { //无属性
      wx.request({
        url: app.data.apiUrl + "/bargain/create-bargain?sign=" + wx.getStorageSync("sign"),
        method: "GET",
        data: {
          goods_id: that.data.gid
        },
        success: function (res) {
          //console.log("post", res);
          var status = res.data.status;
          if (status == 1) {
            console.log('发起砍价成功', res.data.data)
            wx.navigateTo({
              url: '../bargainInform/bargainInform?bargain_id=' + res.data.data + '&gid=' + that.data.gid
            })
          } else {
            that.showZanToast(res.data.msg);
          }
          that.setData({
            arr: [],
            values: [],
            price: 1
          })

        }
      })
    }
    that.setData({
      arr: [],
      values: [],
      price: 1
    })
  },
  leibieall: function (e) {
    var index = e.currentTarget.dataset.index;
    var anids = e.currentTarget.dataset.anid;
    this.setData({
      anids: anids,
      index: index
    });
  },
  //选择型号
  xuanze: function (e) {
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
      var _attribute = that.data.inform.attribute;
      var _inform = that.data.inform;
      // //////////////
      var attribute_value = _attribute[index].attribute_value;
      // console.log("attribute_value", attribute_value);
      // console.log(attribute_value.length);
      for (var j = 0; j < attribute_value.length; j++) {
        attribute_value[j].active = false;
        if (avid == attribute_value[j].avid) {
          attribute_value[j].active = true;
          var avid1 = attribute_value[j].avid;
          var figure = attribute_value[j].figure;
          if (figure != '') {
            figure = attribute_value[j].figure;
          } else {
            figure = that.data.figure;
          }

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
        }
      }

      //////////////////////////////////////////////
      var attribute = "";
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
          attribute += arr[i] + ',';
        }
      }

      attribute = attribute.substr(0, attribute.length - 1);
      console.log(attribute, "attribute");
      var carid = wx.getStorageSync("carid");
      var attrLen = that.data.inform.attribute.length;//获取attribute长度
      var arrlen = that.data.arr.length; //数组长度
      // console.log('low_price:', that.data.inform.low_price);
      var priceGroup = that.data.inform.priceGroup;
      var s = 'attr' + attribute;
      for (var i = 0; i < priceGroup.length; i++) {
        // console.log('|||||||||||', priceGroup[i].key);
        // console.log('\\\\\\\\\\',s);
        if (priceGroup[i].key == s) {
          // console.log("iiiiii",i);
          var i = i;
          that.setData({
            i: i
          });
          var nowPrice = that.data.inform.priceGroup[that.data.i].price;
          //console.log('nowPrice:', nowPrice);
          that.setData({
            inform: _inform,
            figure: figure,
            low_price: nowPrice,
            high_price: nowPrice
          })
        }
      }
      //console.log(that.data.low_price + '低;高' + that.data.high_price)
      ///////////////////////////////////////////////


      that.setData({
        inform: _inform,
        figure: figure
      })
      ///////////////
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
    // 将数值与状态写回 
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
    // 将数值与状态写回 
    this.setData({
      price: price,
      minusStatus: minusStatus
    });
  },
  onShow: function () {
    console.log('onshow');
    let that = this;
    if (!wx.getStorageSync('sign')){
      app.getAuth(function () {
        wx.request({
          url: app.data.apiUrl + '/bargain/bargain-list?sign=' + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("砍价列表", res)
            // 获取用户名称及发表时间
            var goodsList = res.data.data.goodsList;
            that.setData({
              main_content: goodsList
            })
            wx.hideLoading()
          }
        });
      })
    }else{
      wx.request({
        url: app.data.apiUrl + '/bargain/bargain-list?sign=' + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("砍价列表", res)
          // 获取用户名称及发表时间
          var goodsList = res.data.data.goodsList;
          that.setData({
            main_content: goodsList
          })
          wx.hideLoading()
        }
      });
    }
    
  },



}))
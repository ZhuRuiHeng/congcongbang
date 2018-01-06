
// pages/search/search.js
//引用common.js公共文件
var common = require('../../common.js');
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  /**
   * 页面的初始数据
   */
  data: {
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
    i: 0 ,
    searchWord : ''
  },
  //引用common.js文件 返回首页
  backHome: function () {
    common.backHome();
  },
  inputValue: function (e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      searchWord: e.detail.value
    })
  },
  searchBtn: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    wx.request({
      url: app.data.apiUrl + "/api/search-goods-list?sign=" + sign ,
      data: {
        keywords: that.data.searchWord
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log(res);
        var status = res.data.status;
        if (status == 1){
          // 此处清空全局的数据
          var main_content = [];
          // 获取用户名称及发表时间
          var contentTip = res.data.data.goodsList;
          var len = contentTip.length;
          if (len == 0){
            that.showZanToast(' 没有找到相关商品！ ');
          }
          that.setData({
            main_content: contentTip
          })
        }else{
          that.showZanToast('搜索失败');
        }
        
      }
    })
  },


  // 获取索引默认加载引用
  suoyin: function (e) {
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
      _gid: gid
    })
    wx.request({
      url: app.data.apiUrl + "/api/goods-detail?sign=" + sign ,
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
    var num = that.data.price;
    console.log('gid', gid + 'num', num + 'attribute', attribute);
    wx.request({
      url: app.data.apiUrl+"/api/add-carts?sign=" + sign ,
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
  //类别
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

  /* 输入框事件 */
  bindManual: function (e) {
    var price = e.detail.value;
    // 将数值与状态写回 
    this.setData({
      price: price
    });
  }
 
}))
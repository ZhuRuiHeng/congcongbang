// pages/dingdanInform/dingdanInform.js
//支付
const paymentUrl = require('../../config').paymentUrl;
var Zan = require('../../dist/index');
var sign = wx.getStorageSync('sign');
var app = getApp();
Page(Object.assign({}, Zan.Toast, {
  data: {
    gid: "",
    attr: "",//属性
    types: "", //类型
    userMes: '',//留言信息
    num: '', //数量
    addCar: false,
    amount: "",
    inform: [],
    _num: 1, //类型
    arr: [],
    attrLen: '',
    values: [], //型号
    shuxing: '',
    all: []
  },
  onLoad: function (options) {
    console.log(options);
    var sign = wx.getStorageSync('sign');
    var that =this;
    var attr = options.attr;
    if (attr == undefined) {
      var attr = 0;
      that.setData({
        attr: attr,
      })
    }
    //this.nextAddress();
    var _type = options.type;
    if (_type == undefined) {
      _type = 0;
    }
    console.log("_type:", _type);
    that.setData({
      gid: options.gid,
      num: options.price,
      types: options.types,
      //detail: options.gid + '-' + attr + '-' + options.bargain_price,
      low_price: options.low_price,
      type: _type,
      bargain_id: options.bargain_id,
      bargain_price: options.bargain_price
    })
    var gid = that.data.gid;//列表页传来的
    var num = that.data.num;
    var detail = that.data.detail;
    var low_price = that.data.low_price;
    var type = that.data.type;
    console.log("列表页传来的gid:", gid + 'gid,' + num + 'num,' + detail + 'detail,' + type + 'type,' + low_price + 'low_price')
    var num = that.data.num;

  },

  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var dizhi = wx.getStorageSync("dizhi");
    that.setData({
      dizhi: dizhi
    })
    console.log("dizhi:", that.data.dizhi);
    if (dizhi != undefined) {
      that.setData({
        dizhi: dizhi
      })
    }else {
      console.log(2222);
    }
    wx.request({
      url: app.data.apiUrl + "/api/goods-detail?sign=" + sign,
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
        var picture = inform.picture;
        var informImg = inform.content;
        var is_membership = res.data.data.is_membership;
        that.setData({
          inform: inform,
          figure: inform.picture[0],
          low_price: inform.low_price,
          high_price: inform.high_price,
          informImg: informImg.toString(),
          imgUrls: picture,
          shuxing: inform.attribute,
          is_collect: inform.is_collect,
          is_membership: is_membership
        })
        var shuxing = that.data.shuxing;
        console.log("属性：", shuxing);
        var all = [];
        for (var i = 0; i < shuxing.length; i++) {
          console.log(i);
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
        //console.log("all:", that.data.all);
        wx.hideLoading()
      }
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
  radioChange: function (e) {
    var value = e.detail.value;
    if (value == 0) {
      this.setData({
        amound: ''
      });
    }
    this.setData({
      rid: e.detail.value
    });
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
  //加入购物车
  addCars: function (e) {
    var that = this;
    var sign = wx.getStorageSync('sign');
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
    that.setData({
      addCar: false,
      detail: that.data.gid + '-' + attribute + '-' + 1 //gid  属性  价格
    })
  },
  //地址
  nextAddress: function () {
    console.log("nextAddress");
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            dizhi: res
          })
          wx.setStorageSync('dizhi', res);
        },
        fail: function (err) {
          console.log("用户不允许");
          // wx.redirectTo ({
          //   url: '../use/use'
          // })
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法正常使用收货地址。请10分钟后再次点击授权，或者删除小程序重新进入。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
          wx.openSetting({
            success: (res) => {
              console.log(res);
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // switch
  listenerSwitch: function (e) {
    console.log('switch类型开关当前状态-----', e.detail.value);
  },
  //input
  userMesInput: function (e) {
    var that = this;

    var userMes = that.data.userMes;
    that.setData({
      userMes: e.detail.value
    })
    // console.log(userMes);
  },
  close: function () {
    var that = this;
    that.setData({
      addCar: false
    })
  },
  queren: function () {
    var that = this;
    var rid = that.data.rid;
    that.setData({
      addCar: false,
      rid: rid
    })
  },
  chage: function (e) {
    var that = this;
    var amount = e.currentTarget.dataset.amount;
    that.setData({
      amount: amount
    })
  },
  //购物车
  addCar: function (e) {
    var that = this;
    var gid = e.currentTarget.dataset.gid;
    var sign = wx.getStorageSync("sign");
    console.log("gid", gid);
    that.setData({
      gid: gid,
      addCar: true,
    })
  },
  //提交订单
  formSubmit: function (e) {
    var that = this;
    var dizhi = that.data.dizhi;
    var sharer_id = wx.getStorageSync('sharer_id');
    if (!that.data.detail){
      that.showZanToast('请选择属性');
      //bargain-buy
    }else{
      if (!sharer_id) {
        sharer_id = 0;
      }
      var rid = that.data.rid;
      if (rid == undefined) {
        that.setData({
          rid: 0
        })
      }
      if (dizhi.length == 0) {
        that.showZanToast('请选择收货地址');
      } else {
        wx.request({
          url: app.data.apiUrl + '/bargain/bargain-buy?sign=' + wx.getStorageSync('sign') + '&type=0' + '&rid=' + that.data.rid + '&bargain_id='+that.data.bargain_id,
          method: 'POST', 
          data: {
            form_id: e.detail.formId,
            receiver: that.data.dizhi.userName,
            message: that.data.userMes,//留言
            receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
            receiver_phone: that.data.dizhi.telNumber,// , // 
            detail: that.data.detail, //"gid -   attribute   - number"
            sharer_id: sharer_id
          },
         success: function (res) {
            var status = res.data.status;
            if (status == 1) {
              // 调用支付
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                'success': function (res) {
                  setTimeout(function () {
                    // 支付成功跳转
                    wx.redirectTo({
                      url: '../bargainInform/bargainInform?bargain_id=' + that.data.bargain_id + '&gid=' + that.data.gid

                    })
                  }, 300)
                },
                'fail': function (res) {
                }
              })
            } else {
              var msg = res.data.msg;
              that.showZanToast(msg);
            }
          },
          fail: function (res) {
            // fail
          },
          complete: function () {

          }
        })
      }
    }
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

}));
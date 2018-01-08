// pages/dingdanInform/dingdanInform.js
//支付
const paymentUrl = require('../../config').paymentUrl;
var Zan = require('../../dist/index');
var sign = wx.getStorageSync('sign');
var app = getApp();
Page(Object.assign({}, Zan.Toast, {
  data: {
    gid : "",
    attr : "",//属性
    types:"", //类型
    userMes: '',//留言信息
    num:'', //数量
    detail:'',
    addCar:false,
    amount:"",
    inform:[]
  },
  onLoad: function (options) {
    console.log('options:', options);
    var sign = wx.getStorageSync('sign');
      var that = this;
      var attr = options.attr;
      if (attr == undefined){
        var attr = 0;
        that.setData({
          attr : attr,
         })
      }
      //this.nextAddress();
      var _type = options.type;
      if (_type == undefined){
        _type = 0;
      }
      console.log("_type:", _type);
      that.setData({
        gid: options.gid,
        num: options.price,
        types: options.types,
        detail: options.gid + '-' + attr + '-' + options.price,
        low_price: options.low_price,
        low_group_price: options.low_group_price,
        type: _type,
        expenses: options.expenses 
      })
      var gid = that.data.gid;//列表页传来的
      var num = that.data.num;
      var detail = that.data.detail;
      var low_price = that.data.low_price;
      var type = that.data.type;
      console.log("列表页传来的gid:", gid + 'gid,' + num + 'num,' + detail + 'detail,' + type + 'type,' + low_price +'low_price')
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
    if (dizhi != undefined){
      that.setData({
        dizhi: dizhi
      })
    }
    else{
      console.log(2222);
      // wx.navigateTo({
      //   url: '../use/use'
      // })
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
        console.log("详情数据", res);
        var list = [];
        // 获取用户名称及发表时间
        var inform = res.data.data.goodsDetail;
        console.log(inform);
        that.setData({
          inform: inform
        })
        wx.hideLoading()
      }
    })
    //优惠券
    wx.request({
      url: app.data.apiUrl+'/api/useable-coupon?sign=' + sign ,
      data:{
        amount: that.data.low_price //商品价格
      },
      success: function (res) {
        console.log("优惠券", res.data.data.useableCoupons);
        that.setData({
          useableCoupons: res.data.data.useableCoupons
        })
      }
    })
  },
  radioChange: function (e) {
    var value = e.detail.value;
    if (value == 0){
      this.setData({
        amound: ''
      });
    }
    this.setData({
      rid: e.detail.value
    });
  },
  //地址
  nextAddress:function(){
    console.log("nextAddress");
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          that.setData({
              dizhi:res
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
  // 显示优惠券
  coupon: function () {
    var that = this;
    that.setData({
      addCar: true
    })
  },
  close:function(){
    var that = this;
    that.setData({
      addCar: false
    })
  },
  queren:function(){
    var that = this;
    var rid = that.data.rid;
    that.setData({
      addCar: false,
      rid: rid
    })
  },
  chage:function(e){
    var that = this;
    var amount = e.currentTarget.dataset.amount;
    that.setData({
      amount: amount
    })
  },
//提交订单
  formSubmit: function (e) {
    var that = this;
    var dizhi = that.data.dizhi;
    var sharer_id = wx.getStorageSync('sharer_id');
    console.log("sharer_id:", sharer_id);
    if (!sharer_id) {
      sharer_id = 0;
    }
    console.log('sharer_id:', sharer_id);
    var rid = that.data.rid;
    if (rid == undefined){
      that.setData({
        rid: 0
      })
    }
    if (dizhi.length == 0){
        that.showZanToast('请选择收货地址');
    }else{
      wx.request({
        url: app.data.apiUrl + '/api/create-order?sign=' + wx.getStorageSync('sign') + '&type=' + that.data.type + '&rid=' + that.data.rid ,
        data: {
          form_id: e.detail.formId,
          receiver: that.data.dizhi.userName,
          message: that.data.userMes,//留言
          receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
          receiver_phone: that.data.dizhi.telNumber, //18749830459,//, 
          detail: that.data.detail,
          sharer_id: sharer_id
        },
        //detail:"gid -   attribute   - number"
        //detail:" 1  -  1:2,2:4,3:6  - 1"
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
         // console.log(res);
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
                  wx.navigateTo({
                    url: '../dingdan/dingdan?status='
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
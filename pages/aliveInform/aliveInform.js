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
    inform: [], Array: ['钱包支付', '返现支付', '积分支付'],
    objectArray: [
      {
        id: 'wallet',
        name: '钱包余额'
      }, {
        id: 'pet_money',
        name: '返现余额'
      }, {
        id: 'point',
        name: '积分余额'
      }
    ],
    pay_type: 'wallet',
    index: 0,
    zindex: false
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
    // wx.request({
    //   url: app.data.apiUrl+'/api/useable-coupon?sign=' + sign ,
    //   data:{
    //     amount: that.data.low_price //商品价格
    //   },
    //   success: function (res) {
    //     console.log("优惠券", res.data.data.useableCoupons);
    //     that.setData({
    //       useableCoupons: res.data.data.useableCoupons
    //     })
    //   }
    // })
  },
  // 提交订单
  submitDingdan() {
    this.setData({
      zindex: true
    })
  },
  // 支付方式
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let index = this.data.index;
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value == 0) {
      this.setData({
        pay_type: 'wallet'
      })
    } else if (e.detail.value == 1) {
      this.setData({
        pay_type: 'pet_money'
      })
    } else if (e.detail.value == 2) {
      this.setData({
        pay_type: 'point'
      })
    }
    console.log('index:', index);
    console.log('pay_type:', this.data.pay_type);
  },
  // 关闭
  closeIndex() {
    this.setData({
      zindex: false
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
    var formId = e.detail.formId;
    that.setData({
      zindex: false
    })
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
    } else {
      wx.request({
        url: app.data.apiUrl2 + "/bargain/my-wallet?sign=" + sign,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          let status = res.data.status;
          if (status == 1) {
            console.log("余额", res.data.data);
            let walletNow = res.data.data.wallet;   //钱包余额1
            let pet_moneyNow = res.data.data.pet_money;//返现余额2
            let pointNow = res.data.data.point;    //积分余额3
            let totalPrice = that.data.totalPrice;   //商品价格
            let expenses = that.data.expenses;    //运费
            let payment = totalPrice * 1 + expenses;//总支付金额
            // 支付方法
            function allPayment(pay_type) {
              wx.request({
                url: app.data.apiUrl2 + '/api/create-order?sign=' + wx.getStorageSync('sign'),
                data: {
                  form_id: formId,
                  receiver: that.data.dizhi.userName,
                  message: that.data.userMes,//留言
                  receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
                  receiver_phone: that.data.dizhi.telNumber, //'18749830459'
                  detail: that.data.detail, //detail:"gid -   attribute   - number"
                  sharer_id: sharer_id,
                  pay_type: pay_type //1wallet钱包 2pet_money返现账户支付 3point积分账户 多种支付使用, 分隔 缺少时单独使用移动支付 
                },
                method: 'POST',
                success: function (res) {
                  console.log(res);
                  var status = res.data.status;
                  if (status == 1) {
                    if (!res.data.data.timeStamp) {
                      that.showZanToast('支付成功！');
                      // 保存formid
                      wx.request({
                        url: app.data.apiUrl + "/api/save-form?sign=" + wx.getStorageSync('sign'),
                        data: {
                          form_id: formId
                        },
                        header: {
                          'content-type': 'application/json'
                        },
                        method: "GET",
                        success: function (res) {
                          console.log('保存formid成功');
                        }
                      })
                      // 支付成功跳转
                      wx.navigateTo({
                        url: '../dingdan/dingdan?status='
                      })
                    }else{
                      wx.requestPayment({
                        timeStamp: res.data.data.timeStamp,
                        nonceStr: res.data.data.nonceStr,
                        package: res.data.data.package,
                        signType: res.data.data.signType,
                        paySign: res.data.data.paySign,
                        success: function (res) {
                          let status = res.data.data.status;
                          if (status == 1) {
                            that.showZanToast('支付成功！');
                            setTimeout(function () {
                              that.setData({
                                gouwu: []
                              })
                              // 保存formid
                              wx.request({
                                url: app.data.apiUrl + "/api/save-form?sign=" + wx.getStorageSync('sign'),
                                data: {
                                  form_id: formId
                                },
                                header: {
                                  'content-type': 'application/json'
                                },
                                method: "GET",
                                success: function (res) {
                                  console.log('保存formid成功');
                                }
                              })
                              // 支付成功跳转
                              wx.navigateTo({
                                url: '../dingdan/dingdan?status='
                              })
                            }, 10)
                          } else {
                            console.log(res.data.data.msg)
                            that.showZanToast('支付失败！');
                          }
                        },
                        fail: function (res) {
                          that.showZanToast('您取消了支付！');
                        }
                      })
                    }
                  } else {
                    that.showZanToast(res.data.msg);
                  }
                  that.setData({
                    // gouwu: []
                  })
                },
                fail: function (res) {
                  console.log(res)
                },
              })
            }
            // 模式1 模式2 模式3 模式1+2 模式1+3
            //（1）返现账户和积分账户不能相互抵用
            //（2）返现账户余额不足仅可调用充值账户
            //（3）积分账户余额不足仅可调用充值账户
            console.log("payment:", payment);
            if (that.data.pay_type == 'wallet') { //模式1
              console.log('模式' + 1);
              if (walletNow < payment) {
                allPayment('wallet,pet_money');
              } else {
                allPayment('wallet');
              }
            } else if (that.data.pay_type == 'pet_money') { //模式2
              console.log('模式' + 2);
              if (pet_moneyNow < payment) {
                allPayment('pet_money,wallet');
              } else {
                allPayment('pet_money');
              }
            } else if (that.data.pay_type == 'point') { //模式3
              console.log('模式' + 3);
              if (pointNow < payment) {
                allPayment('point,wallet');
              } else {
                allPayment('point');
              }
            }
          } else {
            tips.alert(res.data.msg);
          }
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
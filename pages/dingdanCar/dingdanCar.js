var common = require('../../common.js');
const paymentUrl = require('../../config').paymentUrl;
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index'); 
Page(Object.assign({}, Zan.Toast, {
  data: {
    userMes : '',
    Array: ['钱包支付', '返现支付','积分支付'],
    objectArray:[
      {
        id: 'wallet',
        name: '钱包余额'
      },{
        id: 'pet_money',
        name: '返现余额'
      },{
        id: 'point',
        name: '积分余额'
      }
    ],
    gouwu:[],
    pay_type: 'wallet',
    index:0,
    zindex:false
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
      console.log(options);
      var that = this;
      //this.nextAddress();
      that.setData({
        totalPrice: options.totalPrice
      })
  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var dizhi = wx.getStorageSync("dizhi");
    var _gouwu = wx.getStorageSync("gouwu");
    console.log("dizhi",dizhi);
    console.log('_gouwu',_gouwu);
    
    if (dizhi != undefined) {
      that.setData({
        dizhi: dizhi,
        gouwu:_gouwu
      })
      var gouwu = that.data.gouwu;
      console.log('old:', gouwu.length);
      var detailall = "";
      var attributeAll = "";
      for (i = gouwu.length - 1; i > 0; i--) {
        if (gouwu[i] == null) {
          console.log('1111111111',gouwu);
          gouwu.splice(i, 1);
        }
      }
      that.setData({
        gouwu: gouwu
      })
      console.log('new:',that.data.gouwu.length);
       var gouwu = that.data.gouwu;
       if (gouwu[0] == null){
         gouwu.shift();
       }
       console.log('gouwu:', gouwu);
      for (var i = 0; i < gouwu.length; i++) {
        //console.log('gouwu[i].gid:', i, gouwu[i].detail, gouwu[i].gid);
        if (gouwu[i] == null){
          gouwu.splice(i, 1);
        }
        if (gouwu[i].detail == ''){
          gouwu[i].detail = 0;
        }   
        detailall += gouwu[i].gid + '-' + gouwu[i].detail + '-' + gouwu[i].number + ';';       
      }
      
      // 截取最后一位字符
      detailall = detailall.substr(0, detailall.length - 1);
      console.log("detailall", detailall);
      that.setData({
        detailall: detailall,
        gouwu:gouwu
      })
      let gouwuLen = that.data.gouwu;
      let gidLen   = ''; //string
      let _gidLen = []; //arr
      let gidMoney = []; //arr运费
      let expenses = 0;
      for (let i = 0; i < gouwuLen.length;i++){
        gidLen += gouwuLen[i].gid + ','; 
      }
      // 请求运费
      wx.request({
        url: app.data.apiUrl2 + '/api/goods-expenses?sign=' + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          gids: gidLen
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("运费", res.data.data);
          let freight = res.data.data;
          console.log("freight:", freight);
          //JSON.stringify
          for (i in freight) {
            _gidLen.push(i);//属性数组
            gidMoney.push(freight[i]); //值数组
          }; 
          for (let j=0;j < gidMoney.length;j++){
            expenses += gidMoney[j]*1;
          }
          that.setData({
            expenses :expenses
          })
          wx.hideLoading()
        }
      });
    } else {
      console.log("请选择地址")
    }
  },
  submitDingdan(){
    this.setData({
      zindex:true
    })
  },
  // 支付方式
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let index = this.data.index;
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value==0){
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
  close() {
    this.setData({
      zindex: false
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
            content: '您点击了拒绝授权，将无法正常使用收货地址。请再次点击授权通讯地址，或者删除小程序重新进入。',
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
    console.log(userMes);
  },

  //提交订单
  formSubmit: function (e) {
    var sign = wx.getStorageSync('sign');
    let that = this;
    var dizhi = that.data.dizhi;
    var sharer_id = wx.getStorageSync('sharer_id');
    var formId = e.detail.formId;
    that.setData({
      zindex: false
    })
    if (!sharer_id){
      sharer_id = 0;
    }
    console.log('sharer_id:', sharer_id);
    if (dizhi.length == 0) {
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
            console.log("余额 ", res.data.data);
            let walletNow     =  res.data.data.wallet;   //钱包余额1
            let pet_moneyNow  =  res.data.data.pet_money;//返现余额2
            let pointNow      =  res.data.data.point;    //积分余额3
            let totalPrice =  that.data.totalPrice;   //商品价格
            let expenses   =  that.data.expenses;    //运费
            let payment    =  totalPrice * 1 + expenses;//总支付金额
            // 支付方法
            function allPayment(pay_type) {
              wx.request({
                url: app.data.apiUrl2+'/api/create-order?sign=' + wx.getStorageSync('sign'),
                data: {
                  form_id: formId,
                  receiver: that.data.dizhi.userName,
                  message: that.data.userMes,//留言
                  receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
                  receiver_phone: that.data.dizhi.telNumber, //'18749830459'
                  detail: that.data.detailall, //detail:"gid -   attribute   - number"
                  sharer_id: sharer_id,
                  pay_type: pay_type //1wallet钱包 2pet_money返现账户支付 3point积分账户 多种支付使用, 分隔 缺少时单独使用移动支付 
                },
                method: 'POST',
                success: function (res) {
                  console.log(res);
                  var status = res.data.status;
                  if (status == 1) {
                    if (!res.data.data.timeStamp){
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
                            setTimeout(function () {
                              that.setData({
                                gouwu: []
                              })
                              console.log('gouwulast', that.data.gouwu);
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
                          that.showZanToast('您取消了订单支付');
                        }
                      })
                    }
                  } else {
                    that.showZanToast(res.data.msg);
                    console.log(11111111)
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
            if (that.data.pay_type == 'wallet'){ //模式1
              console.log('模式'+1);
              if (walletNow < payment){
                allPayment('wallet,pet_money');
              }else{
                allPayment('wallet');
              }
            } else if (that.data.pay_type == 'pet_money') { //模式2
              console.log('模式' + 2);
              if (pet_moneyNow < payment) {
                allPayment('pet_money,wallet');
              } else {
                allPayment('pet_money');
              }
            } else if (that.data.pay_type =='point') { //模式3
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
  
  }
}))

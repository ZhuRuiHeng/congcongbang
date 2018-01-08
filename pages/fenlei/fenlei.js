//index.js
var list = [], that, data, listadd;
var common = require('../../common.js');
var sign = wx.getStorageSync('sign');
//获取应用实例
main_content: [];//最新最热
main_content2: [];//列表
modules: [];//模板
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    page: 0,  //分页
    addCar: false,//打开购物车
    closeCar: true,//关闭购物车
    price: 1,//购物车数量
    minusStatus: 'disabled',//数量为1禁用
    kucun:false, //add
    sum: '',//购物车id
    _num: "", //类型型号
    state: 0,
    cate: 0,
    arr: [],
    attrLen: '', //长度
    values: [], //型号
    figure: '',
    i: 0,
    page: 1
  },
  //分类模块切换
  tapKeyWorld1: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var modules = that.data.modules;
    var cate = e.currentTarget.dataset.cate;
    console.log(cate);
    that.setData({
      cate_id: cate
    })
    setTimeout(function () {                  // 获取模块列表索引
      var active1 = e.currentTarget.dataset.active;         // 获取当前商品的选中状态
      var active1 = true;
      var _modules = that.data.modules;
      var sonCategory = modules.sonCategory;
      console.log("22222222222", sonCategory);
      for (var j = 0; j < sonCategory.length; j++) {
        sonCategory[j].active = false;
        if (cate == sonCategory[j].cate_id) {
          sonCategory[j].active = true;
        }
      }
     // sonCategory = sonCategory;
      that.setData({
        modules: modules
      })
      wx.request({
        url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign') ,
        data: {
          cate_id: that.data.cate_id,
          limit: 10
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("allll",res)
          that.setData({
            sonCategory: res.data.data.goodsList
          })
          wx.hideLoading()
        }
      })
    }, 300)

  },

  //购物车选择商品
  addCar: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    });
    var that = this;
    // var inform = that.data.inform;    
    var gid = e.currentTarget.dataset.gid;
    var sign = wx.getStorageSync('sign');
    // inform[gid]
    wx.setStorageSync("carid", gid);
    wx.setStorageSync("length", gid);
    console.log("carid", gid);
    that.setData({
      _gid: gid
    })
    wx.request({
      url: app.data.apiUrl+"/api/goods-detail?sign=" + sign ,
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
          high_price: inform.high_price,
          expenses: inform.expenses,
          is_alive: inform.is_alive
        })
        //库存为0 不能增加total_stock
        console.log(that.data.inform.total_stock);
        if (that.data.inform.total_stock < 2) {
          that.setData({
            kucun: true
          })
        }
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
      url: app.data.apiUrl+"/api/add-carts?sign=" + sign ,
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
    var carid = wx.getStorageSync("carid");
    var attrLen = that.data.inform.attribute.length;//获取attribute长度
    var arrlen = that.data.arr.length; //数组长度
    if (that.data.is_alive==1){ //活体
      if (attrLen > 0) {
        if (arrlen == attrLen) {
          that.setData({
            addCar: false
          })
          wx.navigateTo({
            url: '../aliveInform/aliveInform?gid=' + carid + '&price=' + that.data.price + '&attr=' + attribute + '&types=' + types + '&low_price=' + that.data.low_price + '&expenses=' + that.data.expenses
          })
        } else {
          that.showZanToast('请选择属性');
        }
      } else {
        wx.navigateTo({
          url: '../aliveInform/aliveInform?gid=' + carid + '&' + 'price=' + that.data.price + '&types=' + types + '&low_price=' + that.data.low_price + '&expenses=' + that.data.expenses
        })
      }
    }else{
      if (attrLen > 0) {
        if (arrlen == attrLen) {
          that.setData({
            addCar: false
          })
          wx.navigateTo({
            url: '../dingdanInform/dingdanInform?gid=' + carid + '&price=' + that.data.price + '&attr=' + attribute + '&types=' + types + '&low_price=' + that.data.low_price + '&expenses=' + that.data.expenses
          })
        } else {
          that.showZanToast('请选择属性');
        }
      } else {
        wx.navigateTo({
          url: '../dingdanInform/dingdanInform?gid=' + carid + '&' + 'price=' + that.data.price + '&types=' + types + '&low_price=' + that.data.low_price + '&expenses=' + that.data.expenses
        })
      }
    }
    
    that.setData({
      arr: [],
      values: [],
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
    //console.log('+');
    var price = this.data.price;
    let inform = this.data.inform;
    // 不作过多考虑自增1 
    price++;
    console.log('库存：', kucun);
    let kucun = inform.total_stock - price < 1 ? true : false;
    // var minusStatus = price < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      price: price,
      kucun: kucun
    });
    console.log('kucun:', this.data.kucun);
  },

  /* 输入框事件 */
  bindManual: function (e) {
    var price = e.detail.value;
    this.setData({
      price: price
    });
  },
  // 加载
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var cate_id = options.cate_id;
    var index = options.index;
    console.log("传：",cate_id+'/////////'+index);
    that.setData({
      cate_id: options.cate_id,
      index: options.index
    })
  },
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    console.log(wx.getStorageSync('sign'));
    if (!wx.getStorageSync('sign')) {
      app.getAuth(function () {
        //获取所有分类
        wx.request({
          url: app.data.apiUrl + '/api/get-category?sign=' + sign,
          method: "GET",
          success: function (res) {
            console.log("获取所有分类", res);
            var alldata = res.data;
            var fenlei = res.data.categorys;
            that.setData({
              modules: fenlei,
            })

            var cate_id = that.data.cate_id;
            var index = that.data.index;
            var contentTip = that.data.modules[index];
            var sonCategory = that.data.modules[index].sonCategory;
            var Len = sonCategory.length + 2;
            var width = 130 * Len;
            that.setData({
              modules: contentTip,
              w_width: width
            })
            console.log("sonCategory:", sonCategory)
            wx.hideLoading();
            // // 默认渲染列表
            // 默认渲染列表
            setTimeout(function () {
              var modules = that.data.modules;
              var lengths = modules.sonCategory.length;
              if (lengths == 0) {
                console.log("无子cate_id：", that.data.cate_id);
                wx.request({
                  url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign'),
                  data: {
                    cate_id: that.data.cate_id
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log("len0", res);
                    that.setData({
                      sonCategory: res.data.data.goodsList
                    })
                    wx.hideLoading()
                  }
                })
              } else {
                var cate_id = modules.sonCategory[0].cate_id;
                console.log('cate_id:', cate_id);
                wx.request({
                  url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign'),
                  data: {
                    cate_id: cate_id
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    console.log("len1", res);
                    that.setData({
                      sonCategory: res.data.data.goodsList
                    })
                    wx.hideLoading()
                  }
                })
              }
            }, 300)
          },
        });
      })
    }else{
      //获取所有分类
      wx.request({
        url: app.data.apiUrl + '/api/get-category?sign=' + sign,
        method: "GET",
        success: function (res) {
          console.log("获取所有分类", res);
          var alldata = res.data;
          var fenlei = res.data.categorys;
          that.setData({
            modules: fenlei,
          })

          var cate_id = that.data.cate_id;
          var index = that.data.index;
          var contentTip = that.data.modules[index];
          var sonCategory = that.data.modules[index].sonCategory;
          var Len = sonCategory.length + 2;
          var width = 130 * Len;
          that.setData({
            modules: contentTip,
            w_width: width
          })
          console.log("sonCategory:", sonCategory)
          wx.hideLoading();
          // // 默认渲染列表
          // 默认渲染列表
          setTimeout(function () {
            var modules = that.data.modules;
            var lengths = modules.sonCategory.length;
            if (lengths == 0) {
              console.log("无子cate_id：", that.data.cate_id);
              wx.request({
                url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign'),
                data: {
                  cate_id: that.data.cate_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("len0", res);
                  that.setData({
                    sonCategory: res.data.data.goodsList
                  })
                  wx.hideLoading()
                }
              })
            } else {
              var cate_id = modules.sonCategory[0].cate_id;
              console.log('cate_id:', cate_id);
              wx.request({
                url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign'),
                data: {
                  cate_id: cate_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("len1", res);
                  that.setData({
                    sonCategory: res.data.data.goodsList
                  })
                  wx.hideLoading()
                }
              })
            }
          }, 300)
        },
      });
    }
   
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
    var oldGoodsList = that.data.sonCategory;
    console.log("oldGoodsList:" + oldGoodsList);
    var goodsList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log(that.data.page);
    console.log("下拉cate_id：", that.data.cate_id);
    wx.request({
      url: app.data.apiUrl + "/api/goods-list?sign=" + wx.getStorageSync('sign') ,
      data: {
        page: reqPage,
        cate_id: that.data.cate_id,
        limit:20
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
          sonCategory: newContent,
          page: reqPage
        });
        wx.hideLoading()
        console.log("newContent:" + that.data.newContent)
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
 
  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function () {
    var that = this;
    var mid = wx.getStorageSync('mid');
    return {
      title: "更多",
      path: '/pages/fenlei/fenlei?mid=' + mid + '&cate_id=' + that.data.cate_id + '&index=' + that.data.index,
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
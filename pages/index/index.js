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
    lunbo : [],
    fightGroup:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    page: 0,  //分页
    addCar: false,//打开购物车
    closeCar: true,//关闭购物车
    price: 1,//购物车数量
    minusStatus: 'disabled',//数量为1禁用
    sum:'',//购物车id
    _num:"", //类型型号
    state:0,
    cate: 0,
    arr: [],
    attrLen:'', //长度
    values:[], //型号
    figure:'',
    i :0 ,
    activity: true, //帮砍价库存问题
    bargain_id:''//砍价id
},
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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
  //轮播图点击跳转
  swipclick: function (e) {
    console.log(e);
    var url = e.currentTarget.dataset.url
    wx.navigateTo({ 
      url: '../webpage/webpage?url=' + url 
    })
  },
  //搜索跳转
search: function() {
  wx.navigateTo({
    url: '../search/search'
  })
},
//1最新最热
tapKeyWorld: function (e) {
  wx.showLoading({
    title: '加载中',
  })
  var   that = this;
  var   word = e.currentTarget.dataset.ontap;
  var   cate = e.currentTarget.dataset.cate;
  var  state = e.currentTarget.dataset.state;
  var   sign = wx.getStorageSync('sign');
 // console.log(e.target.dataset.state) 
  console.log("索引", cate);
  console.log("关键字", word);
  console.log('cate_id', cate)
  this.setData({
    searchword : word,
        cateid : cate,
        state: state 
  })
  wx.request({
    url: app.data.apiUrl2+"/api/goods-list?sign=" +sign ,
    data: {
        order : that.data.searchword,
      cate_id : that.data.cateid,
      limit:4
    },
    header: {
      'content-type': 'application/json'
    },
    method: "GET",
    success: function (res) {
      // 此处清空全局的数据
      console.log("筛选2",res);
      var main_content = [];
      // 获取用户名称及发表时间
      var contentTip = res.data.data.goodsList;
      console.log('main_content', contentTip);
      that.setData({
        main_content: contentTip
      })
      wx.hideLoading()
    }
  })
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
//分类模块切换
tapKeyWorld1: function (e) {
  var sign = wx.getStorageSync('sign');
  wx.showLoading({
    title: '加载中',
  })
  var that = this;
  var modules = that.data.modules;
  var cate = e.currentTarget.dataset.cate;
  that.setData({
    cate_id: cate
  })
  setTimeout(function(){
    var allindex = that.data.allindex;                   // 获取模块列表索引
    var active1 = e.currentTarget.dataset.active;         // 获取当前商品的选中状态
    var active1 = true;
    var sonCategory = modules[allindex].sonCategory;
    var _modules = that.data.modules;
      for (var j = 0; j < sonCategory.length; j++) {
        sonCategory[j].active = false;
        if (cate == sonCategory[j].cate_id) {
          sonCategory[j].active = true;
        }
      }
      _modules[allindex].sonCategory = sonCategory;
      that.setData({
        modules: modules
      })
    wx.request({
      url: app.data.apiUrl2+"/api/goods-list?sign=" + sign ,
      data: {
        cate_id: that.data.cate_id,
        limit: 4
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        // 此处清空全局的数据
        console.log("cate_id", that.data.cate_id);
        var typelist = [];
        // 获取用户名称及发表时间
        var contentTip = res.data.data.goodsList;
        
        modules[allindex].typelist = [];
        modules[allindex].typelist = contentTip;
        console.log('typelist', modules[allindex].typelist);
        that.setData({
          modules: modules
        })
        wx.hideLoading()
      }
    })
  },300)
      
},
 //事件处理函数
bindViewTap: function() {
    wx.navigateTo({
        url: '../logs/logs'
    })
},
//查看全部
seeAll:function(){
  wx.navigateTo({
    url: '../more/more?cate_id=0'
  })
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
    console.log("carid",gid);
    that.setData({
      _gid : gid
    })
    wx.request({
      url: app.data.apiUrl+"/api/goods-detail?sign=" +sign ,
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
    // banner
    wx.request({
      url: app.data.apiUrl1 + "bargain/banner?sign=" + sign,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("砍价获取轮播图", res);
        let status = res.data.status;
        if (status == 1) {
          that.setData({
            banner: res.data.data
          })
        } else {
          console.log(res.data.msg);

        }
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
          values:[]
      })
 },
//  添加购物车
addCars:function(e){
  var sign = wx.getStorageSync('sign');
  var  that = this;
  var gid = that.data._gid;
  var attribute = "";
  var types = "";
  var arr = that.data.arr;
  var values = that.data.values;
  for(var i=0;i<arr.length;i++){
    if(arr[i]){
      attribute += arr[i] + ',';
      types +=values[i];
    }     
  }
  // 截取最后一位字符
  attribute = attribute.substr(0, attribute.length-1);
  var num = that.data.price;
  console.log('gid', gid + 'num', num + 'attribute',attribute);
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
      if (status == 1){
        that.showZanToast('加入购物车成功');
        that.setData({
          addCar: false
        })
      }else{
        that.showZanToast('请选择属性');
      }
      that.setData({
        arr: [],
        values:[],
        price:1
      })
     
    }
  })
 
},
// 发起砍价
receive(e) {
  let that = this;
  let stock = that.data.stock;
  let sign = wx.getStorageSync('sign');
  console.log('库存：', stock);;
  console.log('bargain_id:', that.data.bargain_id);
  console.log('already_bargain', that.data.already_bargain);
  if (stock > 0) { //have
    console.log('砍价already_bargain', that.data.already_bargain)
    if (that.data.already_bargain == false) { //未发起过
      console.log('未发起过')
      console.log("请求砍价id：", app.data.apiUrl1 + "bargain/create-bargain?sign=" + sign + '&operator_id=' + app.data.kid + '&goods_id=' + that.data.informAll.goods_id)
      wx.request({
        url: app.data.apiUrl1 + "bargain/create-bargain?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          goods_id: that.data.informAll.goods_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("砍价id  index", res);
          let status = res.data.status;
          if (status == 1) {
            console.log("bargain_id", res.data.data);
            that.setData({
              bargain_id: res.data.data
            })
            wx.navigateTo({
              url: '../bargainInform/bargainInform?bargain_id=' + that.data.bargain_id
            })
          } else {
            console.log(res.data.data);
            tips.alert('获取bargain_id失败！')
          }
          wx.hideLoading()
        }
      })
    } else {
      console.log('已发起过')
      wx.navigateTo({
        url: '../bargainInform/bargainInform?bargain_id=' + that.data.already_bargain
      })
    }
  } else { //nohave
    console.log('没有库存')
    if (that.data.already_bargain == false) { //未发起过
      wx.showModal({
        content: '已无更多库存，无法发起活动',
        showCancel: false,
        confirmText: "确定"
      })
    }
    else {
      wx.navigateTo({
        url: '../bargainInform/bargainInform?bargain_id=' + that.data.already_bargain
      })
    }

  }

},
// 立即购买
buy:function(e){
  var that = this;
  var attribute = "";
  var types ="";
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
  if (attrLen > 0){
    if (arrlen == attrLen){
      that.setData({
        addCar: false
      })
       wx.navigateTo({
         url: '../dingdanInform/dingdanInform?gid=' + carid + '&price=' + that.data.price + '&attr=' + attribute + '&types=' + types + '&low_price=' + that.data.low_price + '&type=0'
        })
      }else{
         that.showZanToast('请选择属性');
      }
  } else{
      wx.navigateTo({
        url: '../dingdanInform/dingdanInform?gid=' + carid + '&' + 'price=' + that.data.price + '&types=' + types + '&low_price=' + that.data.low_price + '&type=0'
      })
  }
  that.setData({
    arr: [],
    values:[],
    price:1
  })
 },
leibieall:function(e){
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
  var attribute =[];
  setTimeout(function(){
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
        console.log(attribute,"attribute");
        var carid = wx.getStorageSync("carid");
        var attrLen = that.data.inform.attribute.length;//获取attribute长度
        var arrlen = that.data.arr.length; //数组长度
        // console.log('low_price:', that.data.inform.low_price);
        var priceGroup = that.data.inform.priceGroup;
        var s = 'attr' + attribute;
        for (var i = 0; i < priceGroup.length; i++) {
          // console.log('|||||||||||', priceGroup[i].key);
          // console.log('\\\\\\\\\\',s);
          if (priceGroup[i].key == s){
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
          inform : _inform,
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
},
// 加载
onLoad: function (options) {
  let that = this;
  var sharer_id = options.mid;
  wx.setStorageSync("sharer_id", sharer_id);
  if (options.scene) {
    let scene = decodeURIComponent(options.scene);
    console.log("scene:", scene);
    var strs = new Array(); //定义一数组 
    strs = scene.split("_"); //字符分割 
    console.log(strs);
    if (strs[0] =='bargain'){
      console.log("bargain_id:", strs[1]);
      var bargain_id = strs[1];
      that.setData({
        bargain_id: bargain_id
      })
    } else if (strs[0] == 'shop'){
      that.setData({
        gid: strs[2]
      })
    }
  }
 
},
onShow: function () { 
  console.log('onshow');
  let that = this;
  app.getAuth(function () {
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      wx.showLoading({
        title: '加载中',
      });
      // 二维码分享砍价
      if (that.data.bargain_id) {
        wx.navigateTo({
          url: '../bargainShare/bargainShare?bargain_id=' + that.data.bargain_id,
        })
      } else if (that.data.gid) {
        wx.navigateTo({
          url: '../inform/inform?gid=' + that.data.gid,
        })
      }
      // banner
      wx.request({
        url: app.data.apiUrl1 + "bargain/banner?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("砍价获取轮播图", res);
          let status = res.data.status;
          if (status == 1) {
            that.setData({
              banner: res.data.data
            })
          } else {
            console.log(res.data.msg);

          }
        }
      })
      wx.request({
          url: app.data.apiUrl+'/api/carousel-goods?sign=' + sign ,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("团秒", res);
            //倒计时
            var nowTime = (new Date()).getTime();
            var begin_time = res.data.data.nextSeckillTime;
            if (res.data.data.nextSeckillTime){

            }
            // console.log(nowTime + 'sssssssss' + begin_time);
            var ge_nowTime = common.time(nowTime / 1000, 1);
            var be_gainTime = common.time(begin_time, 1);
            var Countdown = begin_time * 1000 - nowTime; //倒计时
            if (Countdown > 0) {
              function dateformat(micro_second) {
                // 秒数
                var second = Math.floor(micro_second / 1000);
                // 小时位
                var day = Math.floor(second / 86400);

                if (day < 10) {
                  day = '0' + day;
                }

                var hr = Math.floor((second - day * 86400) / 3600);
                // 分钟位
                if (hr < 10) {
                  hr = '0' + hr;
                }

                var min = Math.floor((second - hr * 3600 - day * 86400) / 60);
                if (min < 10) {
                  min = '0' + min;
                }
                // 秒位
                var sec = (second - hr * 3600 - min * 60 - day * 86400); // equal to => var sec = second % 60;
                // 毫秒位，保留2位
                if (sec < 10) {
                  sec = '0' + sec;
                }
                var micro_sec = Math.floor((micro_second % 1000) / 10);

                return day + ":" + hr + ":" + min + ":" + sec;
              }

              setInterval(function () {
                Countdown -= 1000;
                var time = dateformat(Countdown);
                var splitArr = time.split(":");
                //console.log(splitArr);
                var _Countdown = [{
                  day: splitArr[0],
                  hr: splitArr[1],
                  min: splitArr[2],
                  sec: splitArr[3],
                }];
              //console.log(_Countdown);
                that.setData({
                  countDown_tatic: true,
                  Countdown: _Countdown
                })
              }, 1000)
            } else {
              countDown_tatic: false
            }
            begin_time = common.time(begin_time, 1);
            var lunbo = [];
            // 获取用户名称及发表时间
            wx.setStorageSync('lunbo', res.data.data.carouselGoods);
            that.setData({
              lunbo: res.data.data.carouselGoods,
              fightGroups: res.data.data.fightGroups,
              seckills: res.data.data.seckills,
              currentSeckillTime: res.data.data.currentSeckillTime,
              nextSeckillTime: that.data.Countdown
            })
          }
      });
      //最热列表
      wx.request({
          url: app.data.apiUrl2+"/api/goods-list?sign=" + sign ,
          data:{
            limit: 4
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            var main_content = [];
            // 获取用户名称及发表时间
            var contentTip = res.data.data.goodsList;
            that.setData({
              main_content: contentTip
            })
          }
      });
      //获取普通分类
      wx.request({
          url: app.data.apiUrl2+'/api/get-category?sign=' + sign ,
          data:{
            type:'ordinary'
          },
          method: "GET",
          success: function (res) {
            console.log("普通分类", res);
            let status = res.data.status;
            if (status==1){
              var alldata = res.data;
              var fenlei = res.data.categorys;
              if (fenlei.length > 7){
                let _fenlei = [];
                for (let i = 0; i < fenlei.length-2;i++){
                  _fenlei[i] = fenlei[i]
                }
                that.setData({
                  modules: _fenlei
                })
                console.log(that.data.modules);
              }else{
                that.setData({
                  modules: fenlei,
                })
              }
              setTimeout(function () {
                var modules = that.data.modules;
                var sindex = [];
                for (let i = 0; i < modules.length; i++) {
                  var a = i;
                  var _modules = that.data.modules;
                }
              }, 300)
              wx.hideLoading()
            }else{
              that.showZanToast(res.data.msg);
            }
           
            
          },
      });
      //获取养宠套餐分类
      wx.request({
        url: app.data.apiUrl2 + '/api/get-category?sign=' + sign,
        data: {
          type: 'meal'
        },
        method: "GET",
        success: function (res) {
          console.log("养宠套餐分类", res);
          let status = res.data.status;
          if (status == 1) {
            var alldata = res.data;
            var fenlei = res.data.categorys;
            that.setData({
              modulesPet: fenlei,
            })
            setTimeout(function () {
              var modulesPet = that.data.modulesPet;
              var sindex = [];
              for (let i = 0; i < modulesPet.length; i++) {
                var a = i;
                var _modulesPet = that.data.modulesPet;
              }
            }, 300)
            wx.hideLoading()
          } else {
            that.showZanToast(res.data.msg);
          }
        },
      });  
  });
},
// 养宠套餐
 // url="../fenlei/fenlei?cate_id={{item.cate_id}}&index={{index}}"
  petTab(e){
    console.log(e);
      wx.navigateTo({
        url: '../fenlei/fenlei?cate_id=' + e.currentTarget.dataset.cate_id + '&index=' + e.currentTarget.dataset.allindex,
      })
  },
  // 搜索框
  inputSearch: function (e) {  //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function () {  //提交搜索
    console.log(this.data.searchtext);
  },
  bargain(){
    wx.navigateTo({
      url: '../bargainList/bargainList'
    })
  },
  //设置分享
   onShareAppMessage: function () {
     var that = this;
     var mid = wx.getStorageSync('mid');
     console.log("getStorageSync:",mid);
     return {
       title: "宠宠邦",
       path: '/pages/index/index?mid=' + mid,
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
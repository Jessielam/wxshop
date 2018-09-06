import {
  Order
} from '../order/order-model.js';
import {
  Cart
} from '../cart/cart-model.js';
import {
  Address
} from '../../utils/address.js';

var order = new Order();
var cart = new Cart();
var address = new Address();


Page({
  data: {
    fromCartFlag: true,
    addressInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var flag = options.from == 'cart',
      that = this;
    this.data.fromCartFlag = flag;
    var productsArr = {}, account = 0;
    if (flag) {
      account = options.account;      
      productsArr = cart.getCartDataFromLocal(true); // 获取用户下单的商品购物车信息
    } else {
      this.setData({
        id: options.id
      });
    }

    // account 订单总金额
    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0
    });

    /*显示收获地址*/
    address.getAddress((res) => {
      this._bindAddressInfo(res);
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.id) {
      var that = this;
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      var id = this.data.id;
      order.getOrderInfoById(id, (data) => {
        console.log(data)
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          },
        });

        // 快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },

  editAddress: function(event) {
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        }
        that._bindAddressInfo(addressInfo);
        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败！');
          }
        });
      }
    });
  },

  /*绑定地址信息*/
  _bindAddressInfo: function(addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /*
   * 提示窗口
   * params:
   * title - {string}标题
   * content - {string}内容
   * flag - {bool}是否跳转到 "我的页面"
   */
  showTips: function(title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      }
    });
  },

  /*下单和付款*/
  pay: function() {
    if (!this.data.addressInfo) {
      this.showTips('下单提示', '请填写您的收货地址');
      return;
    }
    if (this.data.orderStatus == 0) {
      this._firstTimePay();
    } else {
      // 再次支付
      this._oneMoresTimePay();
    }
  },

  /*第一次支付*/
  _firstTimePay: function() {
    var orderInfo = [],
      procuctInfo = this.data.productsArr,
      order = new Order();
    for (let i = 0; i < procuctInfo.length; i++) {
      orderInfo.push({
        product_id: procuctInfo[i].id,
        count: procuctInfo[i].counts
      });
    }

    var that = this;
    //支付分两步，第一步是生成订单号，然后根据订单号支付
    order.doOrder(orderInfo, (data) => {
      //订单生成成功
      if (data.pass) {
        //更新订单状态
        var id = data.order_id;
        that.setData({
          id: id
        });
        // that.data.fromCartFlag = false;

        //开始支付
        that._execPay(id);
      } else {
        that._orderFail(data); // 下单失败
      }
    });
  },

  /* 再次次支付*/
  _oneMoresTimePay: function() {
    this._execPay(this.data.id);
  },

  /*
   *开始支付
   * params:
   * id - {int}订单id
   */
  _execPay: function(id) {
    if (!order.usePay) {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true); //屏蔽支付，提示
      this.deleteProducts(); //将已经下单的商品从购物车删除
      return;
    }
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        that.deleteProducts(); //将已经下单的商品从购物车删除   当状态为0时，表示

        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=order'
        });
      }
    });
  },

  //将已经下单的商品从购物车删除
  deleteProducts: function() {
    var ids = [],
      arr = this.data.productsArr;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    cart.delete(ids);
  }
})
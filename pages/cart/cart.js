import {Cart} from "cart-model.js";
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartData: {},
    loadingHidden: false,
    selectedCounts: 0, //总的商品数
    selectedTypeCounts: 0, //总的商品类型数
  },

  /**
   * 生命周期函数--监听页面加载 只会执行一次
   */
  onLoad: function (options) {
    
  },

  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
  },

  onShow: function () {
    var cartData = cart.getCartDataFromLocal();
    // var countsInfo = cart.getCartTotalCounts(true);
    var cal = this._calTotalAccountAndCounts(cartData);

    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData,
      loadingHidden: true
    });
  },

  // 选中商品的总金额
  _calTotalAccountAndCounts: function(data) {
    var len = data.length,
    account = 0,
    selectedCounts = 0, // 购买商品的总个数
    selectedTypeCounts = 0;  // 商品类型的总和
    let multiple = 100;

    for (let i=0; i<len; i++) {
      if (data[i].selectStatus) {
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    } 
    return {
      account: account/(multiple*multiple),
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts
    };
  },

  // 复选框的选中与取消
  toggleSelect: function(event) {
    var id = cart.getDataSet(event, 'id'),
      status = cart.getDataSet(event, 'status'),
      index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status; // 修改状态
    this._resetCartData();
    cart.updateAfterSelectChange(this.data.cartData);
  },

  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }
    this._resetCartData();
    cart.updateAfterSelectChange(this.data.cartData);
  },

  _getProductIndexById: function(id) {
    var data = this.data.cartData,
    len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },

  _resetCartData: function() {
    var newData = this._calTotalAccountAndCounts(this.data.cartData);
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData,
    });
  },

  changeCounts: function (event) {
    var id = cart.getDataSet(event, 'id'),
      type = cart.getDataSet(event, 'type'),
      index = this._getProductIndexById(id),
      counts = 1;
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;
      cart.cutCounts(id);
    }
    //更新商品页面
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  /*删除商品*/
  delete: function (event) {
    var id = cart.getDataSet(event, 'id'),
      index = this._getProductIndexById(id);
    this.data.cartData.splice(index, 1);//删除某一项商品

    this._resetCartData();
    //this.toggleSelectAll();

    cart.delete(id);  //内存中删除该商品
  },

  /*提交订单*/
  submitOrder: function () {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart'
    });
  },

  /*查看商品详情*/
  onProductsItemTap: function (event) {
    var id = cart.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  }  
})
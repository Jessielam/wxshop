import {
  Product
} from "./product-module.js";
var product = new Product();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
    hiddenSmallImg: true,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCounts: 1,
    currentTabsIndex: 0,
    cartTotalCounts: 0,
    pageTabs: ['商品详情', '产品参数', '售后保障']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = options.id;
    this.setData({
      id: id
    });
    this._loadData();
  },

  _loadData: function(callback) {
    var that = this;
    product.getDetailInfo(this.data.id, (data) => {
      // console.log(data);
      this.setData({
        product: data,
        loadingHidden: true
      });
      callback && callback();
    });
  },

  bindPickerChange: function(event) {
    this.setData({
      productCounts: this.data.countsArray[event.detail.value]
    });
  },

  onTabsItemTap: function(event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  }
})
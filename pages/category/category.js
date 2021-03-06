import {
  Category
} from "category-model.js";

var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr: ['tanslate0', 'tanslate1', 'tanslate2', 'tanslate3', 'tanslate4', 'tanslate5'],
    currentMenuIndex: 0,
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },

  _loadData: function() {
    // 获取所有分类数据
    var that = this;
    category.getAllCategories((categoryData) => {
      this.setData({
        categoryData: categoryData
      });

      that.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }

        this.setData({
          categoryInfo0: dataObj,
          loadingHidden: true
        });
      });
    })
  },

  getProductsByCategory: function(id, callback) {
    category.getProductByCategory(id, (data) => {
      callback && callback(data);
    });
  },

  /*跳转到商品详情*/
  onProductsItemTap: function(event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  /*切换分类*/
  changeCategory: function(event) {
    var index = category.getDataSet(event, 'index'),
      id = category.getDataSet(event, 'id') //获取data-set
    this.setData({
      currentMenuIndex: index
    });

    //如果数据是第一次请求
    if (!this.isLoadedData(index)) {
      var that = this;
      this.getProductsByCategory(id, (data) => {
        that.setData(that.getDataObjForBind(index, data));
      });
    }
  },

  isLoadedData: function(index) {
    if (this.data['categoryInfo' + index]) {
      return true;
    }
    return false;
  },

  getDataObjForBind: function(index, data) {
    var obj = {},
      arr = [0, 1, 2, 3, 4, 5],
      baseData = this.data.categoryData[index];
    for (var item in arr) {
      if (item == arr[index]) {
        obj['categoryInfo' + item] = {
          products: data,
          topImgUrl: baseData.img.url,
          title: baseData.name
        };

        return obj;
      }
    }
  },

  /*下拉刷新页面*/
  onPullDownRefresh: function() {
    this._loadData(() => {
      wx.stopPullDownRefresh()
    });
  },

  //分享效果
  onShareAppMessage: function() {
    return {
      title: 'aaaaaaaa',
      path: 'pages/category/category'
    }
  }
})
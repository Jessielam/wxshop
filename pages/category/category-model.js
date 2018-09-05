import {Base} from "../../utils/base.js";

class Category extends Base
{
  constructor() {
    super();
  }

  getAllCategories(callback) {
    var params = {
      url: "category/all",
      sCallback: function(categoryData) {
        callback && callback(categoryData);
      }
    };
    this.request(params);
  }

  getProductByCategory(id, callback) {
    var params = {
      url: "product/by_category?id=" + id,
      sCallback: function(productData) {
        callback && callback(productData);
      }
    }
    this.request(params);
  }
}

export {Category};
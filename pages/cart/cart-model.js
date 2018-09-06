import {
  Base
} from "../../utils/base.js";

class Cart extends Base {
  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  /*本地缓存 保存／更新*/
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  };


  /**
   * 添加购物车
   * 如果购物没有这样的商品，则直接新增一条记录，数量为counts
   * 如果已经存在该商品，则原有数量 + counts
   * @param 
   * item - obj  商品对象
   * counts - int 购买数量
   */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();
    var isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index == -1) {
      // 说明购物车还没有该商品
      item.counts = counts;
      item.selectStatus = true; // 购物车中的商品是否选中， 默认true
      // 加入购物车
      cartData.push(item);
    } else {
      cartData[isHasInfo.index].counts += counts;
    }
    // 跟新缓存
    wx.setStorageSync(this._storageKeyName, cartData);
  }

    /*
    *获得购物车商品总数目,包括分类和不分类
    * param:
    * flag - {bool} 是否区分选中和不选中
    * return
    * counts1 - {int} 不分类
    * counts2 -{int} 分类
    */
  getCartTotalCounts(flag)
  {
    var cartData = this.getCartDataFromLocal();
    var counts = 0;
    for(let i=0; i<cartData.length; i++) {
      if (flag) {
        if (cartData[i].selectStatus) {
          counts += cartData[i].counts;
        }
      } else {
        counts += cartData[i].counts;
      }
    }

    return counts;
  }

  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }

    //在下单的时候过滤不下单的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  }

// 判断该id是否已经在购物车中，如果存在，则返回对应的信息
  _isHasThatOne(id, arr) {
    // 数据结构 ？
    var item, result = {
      index: -1
    }
    for (var i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        }
        break;
      }
    }
    return result;
  }

  /*
    * 修改商品数目
    * params:
    * id - {int} 商品id
    * counts -{int} 数目
    * */
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
      console.log(cartData);
    console.log(hasInfo);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 1 || counts == 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  };

  /*
    * 增加商品数目
    * */
  addCounts(id) {
    this._changeCounts(id, 1);
  };

  /*
  * 购物车减
  * */
  cutCounts(id) {
    this._changeCounts(id, -1);
  };

  /*
    * 删除某些商品
    */
  delete(ids) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  updateAfterSelectChange (data) {
    var cartData = this.getCartDataFromLocal(); 
    for (let i=0; i<data.length; i++) {
      if (data[i].id == cartData[i].id) {
        cartData[i].selectStatus = data[i].selectStatus;
      } 
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

}

export {Cart};
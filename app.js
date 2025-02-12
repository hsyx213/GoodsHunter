// app.js
App({
  globalData: {
    favorites: [],
    compareList: [],
    pageSize: 10, // 每页加载的商品数量
    filters: {
      materials: ['铝', '不锈钢', '铸铁'],
      coatings: ['陶瓷涂层', '不粘涂层', '钛涂层'],
      diameters: ['20cm', '24cm', '26cm', '28cm', '30cm']
    }
  },

  onLaunch: function() {
    // 初始化收藏列表
    const favorites = wx.getStorageSync('favorites') || [];
    this.globalData.favorites = favorites;

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },

  // 收藏功能
  toggleFavorite(product) {
    const index = this.globalData.favorites.findIndex(f => f.id === product.id);
    if (index > -1) {
      // 如果已收藏，则取消收藏
      this.globalData.favorites.splice(index, 1);
      return false; // 返回未收藏状态
    } else {
      // 如果未收藏，则添加到收藏
      this.globalData.favorites.push(product);
      return true; // 返回已收藏状态
    }
  },

  // 添加商品到对比列表
  addToCompare(product) {
    const index = this.globalData.compareList.findIndex(c => c.id === product.id);
    if (index > -1) {
      // 如果已在对比列表中，则移除
      this.globalData.compareList.splice(index, 1);
      return false; // 返回未对比状态
    } else {
      // 如果不在对比列表中，则添加
      this.globalData.compareList.push(product);
      return true; // 返回已对比状态
    }
  },

  // 从对比列表移除商品
  removeFromCompare: function(productId) {
    const index = this.globalData.compareList.findIndex(item => item.id === productId);
    if (index > -1) {
      this.globalData.compareList.splice(index, 1);
      return true;
    }
    return false;
  }
})

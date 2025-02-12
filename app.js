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
    },
    products: require('./data/products.js')
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

  // 全局收藏切换方法
  toggleFavorite(product) {
    const favorites = this.globalData.favorites;
    // 确保比较时使用数字类型
    const index = favorites.findIndex(f => parseInt(f.id) === parseInt(product.id));
    
    if (index > -1) {
      // 取消收藏
      favorites.splice(index, 1);
    } else {
      // 添加收藏，确保保存完整的商品信息
      favorites.push({
        ...product,
        id: parseInt(product.id)  // 确保保存为数字类型
      });
    }

    // 更新本地存储
    wx.setStorageSync('favorites', favorites);
    // 更新全局数据
    this.globalData.favorites = favorites;
    
    return index === -1; // 返回是否已收藏
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

// pages/favorite/favorite.js
const app = getApp()
const products = require('../../data/products.js') // 引入商品数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    favorites: [], // 收藏的商品列表
    isCompareMode: false, // 是否处于对比模式
    selectedCount: 0, // 已选择商品数量
    showCompareModal: false, // 是否显示对比弹窗
    selectedProducts: [], // 已选择的商品列表
    productList: [
      {
        name: "爱仕达炒锅不粘锅",
        price: "¥199",
        material: "铝",
        coating: "不粘涂层",
        size: "28cm",
        rating: "4.7分",
        sales: "750",
        imageUrl: "images/placeholder.png" // 使用本地占位图片
      },
      {
        name: "苏泊尔不粘锅炒锅",
        price: "¥159",
        material: "铝",
        coating: "陶瓷涂层",
        size: "26cm",
        rating: "4.6分",
        sales: "800",
        imageUrl: "images/placeholder.png" // 使用本地占位图片
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadFavorites()
    this.checkImageAvailability()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadFavorites()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载收藏列表
  loadFavorites() {
    const favorites = app.globalData.favorites;
    
    // 设置收藏列表数据
    this.setData({ 
      favorites: favorites.map(item => ({
        ...item,
        selected: false
      }))
    });
  },

  checkImageAvailability() {
    const placeholder = "https://via.placeholder.com/150" // 占位图片
    let newProductList = this.data.productList.map(item => {
      return {
        ...item,
        imageUrl: this.isValidImage(item.imageUrl) ? item.imageUrl : placeholder
      }
    })
    this.setData({ productList: newProductList })
  },

  isValidImage(url) {
    return url && url.startsWith("https://img14.360buyimg.com")
  },

  // 切换商品选择状态
  toggleSelect(e) {
    console.log('触发选择事件：', e.currentTarget.dataset.id);
    // 确保 id 是数字类型
    const id = parseInt(e.currentTarget.dataset.id);
    
    const favorites = this.data.favorites.map(item => {
      // 确保比较时也是数字类型
      if (parseInt(item.id) === id) {
        console.log('找到匹配商品：', item);
        if (this.data.selectedCount >= 5 && !item.selected) {
          wx.showToast({
            title: '最多只能对比5个商品',
            icon: 'none'
          });
          return item;
        }
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    const selectedCount = favorites.filter(item => item.selected).length;
    const selectedProducts = favorites.filter(item => item.selected);

    console.log('更新后的选中数量：', selectedCount);
    console.log('更新后的选中商品：', selectedProducts);

    this.setData({
      favorites,
      selectedCount,
      selectedProducts
    });
  },

  // 进入对比模式
  enterCompareMode() {
    console.log('进入对比模式');
    this.setData({
      isCompareMode: true,
      selectedCount: 0,
      selectedProducts: []
    }, () => {
      console.log('对比模式状态：', this.data.isCompareMode);
      console.log('当前收藏列表：', this.data.favorites);
    });
  },

  // 退出对比模式
  exitCompareMode() {
    // 清除所有选中状态
    const favorites = this.data.favorites.map(item => ({
      ...item,
      selected: false
    }));

    this.setData({
      isCompareMode: false,
      selectedCount: 0,
      selectedProducts: [],
      favorites
    });
  },

  // 计算最低价格
  isLowestPrice(price) {
    const prices = this.data.selectedProducts.map(p => p.price);
    return price === Math.min(...prices);
  },

  // 计算最高评分
  isHighestRating(rating) {
    const ratings = this.data.selectedProducts.map(p => p.rating);
    return rating === Math.max(...ratings);
  },

  // 显示对比弹窗
  showCompareModal() {
    if (this.data.selectedCount < 2) {
      wx.showToast({
        title: '请至少选择2个商品',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    // 计算每个商品的最优属性
    const selectedProducts = this.data.selectedProducts.map(product => ({
      ...product,
      isLowestPrice: this.isLowestPrice(product.price),
      isHighestRating: this.isHighestRating(product.rating)
    }));

    this.setData({ 
      showCompareModal: true,
      selectedProducts
    });
  },

  // 隐藏对比弹窗
  hideCompareModal() {
    this.setData({ showCompareModal: false });
  },

  // 生成对比数据
  generateCompareData() {
    const products = this.data.selectedProducts;
    return {
      prices: products.map(p => p.price),
      materials: products.map(p => p.specs.material),
      coatings: products.map(p => p.specs.coating),
      diameters: products.map(p => p.specs.diameter),
      depths: products.map(p => p.specs.depth),
      ratings: products.map(p => p.rating),
      sales: products.map(p => p.sales)
    };
  },

  // 取消收藏
  toggleFavorite(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    const product = e.currentTarget.dataset.product;
    app.toggleFavorite(product);
    
    // 直接从全局数据重新加载收藏列表
    this.loadFavorites();
  },

  // 跳转到购买链接
  goToBuy(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateToMiniProgram({
      appId: 'wx91d27dbf599dff74', // 京东小程序的 appId
      path: url,
      success(res) {
        console.log('跳转成功')
      },
      fail(res) {
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        })
      }
    })
  }
})
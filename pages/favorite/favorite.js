// pages/favorite/favorite.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    favorites: [], // 收藏的商品列表
    isCompareMode: false, // 是否处于对比模式
    selectedCount: 0, // 已选择商品数量
    showCompareModal: false, // 是否显示对比弹窗
    selectedProducts: [] // 已选择的商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadFavorites()
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
    // 每次页面显示时重新加载收藏列表，以同步其他页面的收藏操作
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
    const favorites = wx.getStorageSync('favorites') || []
    // 添加selected属性用于对比模式
    const favoritesWithSelect = favorites.map(item => ({
      ...item,
      selected: false
    }))
    this.setData({ favorites: favoritesWithSelect })
  },

  // 进入对比模式
  enterCompareMode() {
    this.setData({ 
      isCompareMode: true,
      selectedCount: 0,
      selectedProducts: []
    })
  },

  // 退出对比模式
  exitCompareMode() {
    // 重置所有选择状态
    const favorites = this.data.favorites.map(item => ({
      ...item,
      selected: false
    }))
    this.setData({ 
      isCompareMode: false,
      selectedCount: 0,
      selectedProducts: [],
      favorites
    })
  },

  // 切换商品选择状态
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id
    const favorites = this.data.favorites.map(item => {
      if (item.id === id) {
        // 如果已经选择了3个商品且当前商品未选中，则不允许再选
        if (this.data.selectedCount >= 3 && !item.selected) {
          wx.showToast({
            title: '最多只能对比3个商品',
            icon: 'none'
          })
          return item
        }
        return { ...item, selected: !item.selected }
      }
      return item
    })

    // 计算选中数量和选中商品列表
    const selectedProducts = favorites.filter(item => item.selected)
    
    this.setData({
      favorites,
      selectedCount: selectedProducts.length,
      selectedProducts
    })
  },

  // 显示对比弹窗
  showCompareModal() {
    if (this.data.selectedCount < 2) {
      wx.showToast({
        title: '请至少选择2个商品',
        icon: 'none'
      })
      return
    }
    this.setData({ showCompareModal: true })
  },

  // 隐藏对比弹窗
  hideCompareModal() {
    this.setData({ showCompareModal: false })
  },

  // 取消收藏
  toggleFavorite(e) {
    const product = e.currentTarget.dataset.product
    app.toggleFavorite(product)
    this.loadFavorites() // 重新加载收藏列表
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
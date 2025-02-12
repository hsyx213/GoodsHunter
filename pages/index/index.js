// index.js
const app = getApp()

Page({
  data: {
    products: [],
    currentPage: 1,
    loading: false,
    noMore: false,
    
    // 筛选相关
    priceFilterOpen: false,
    materialFilterOpen: false,
    sizeFilterOpen: false,
    sortOptionsOpen: false,
    
    showFilterPanel: false,
    selectedPriceRange: '',
    materials: ['铝合金', '不锈钢', '铸铁', '复合底'],
    sizes: ['20cm', '24cm', '26cm', '28cm', '30cm', '32cm'],
    selectedMaterial: '',
    selectedSize: '',
    sortOptionsVisible: false,
    hasActiveFilters: false,
    
    filters: {},
    
    sortOptions: [
      { text: '综合排序', value: 'default' },
      { text: '价格从低到高', value: 'price-asc' },
      { text: '价格从高到低', value: 'price-desc' },
      { text: '评分从高到低', value: 'rating-desc' },
      { text: '销量从高到低', value: 'sales-desc' }
    ],
    currentSort: { text: '综合排序', value: 'default' }
  },

  onLoad() {
    this.setData({
      filters: app.globalData.filters
    })
    this.loadProducts()
  },

  // 加载商品数据
  async loadProducts() {
    if (this.data.loading || this.data.noMore) return
    
    this.setData({ loading: true })
    
    try {
      // 模拟API请求
      const products = await this.fetchProducts()
      
      // 处理收藏和对比状态
      const processedProducts = products.map(product => ({
        ...product,
        isFavorite: app.globalData.favorites.some(f => f.id === product.id),
        isComparing: app.globalData.compareList.some(c => c.id === product.id)
      }))
      
      this.setData({
        products: [...this.data.products, ...processedProducts],
        currentPage: this.data.currentPage + 1,
        noMore: processedProducts.length < app.globalData.pageSize
      })
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 模拟获取商品数据
  async fetchProducts() {
    // 这里暂时使用本地数据，后续可替换为实际API
    const { products } = require('../../data/products.js')
    const start = (this.data.currentPage - 1) * app.globalData.pageSize
    return products.slice(start, start + app.globalData.pageSize)
  },

  // 筛选相关方法
  showPriceFilter() {
    this.setData({
      priceFilterOpen: !this.data.priceFilterOpen,
      materialFilterOpen: false,
      sizeFilterOpen: false,
      sortOptionsOpen: false
    })
  },

  showMaterialFilter() {
    this.setData({
      materialFilterOpen: !this.data.materialFilterOpen,
      priceFilterOpen: false,
      sizeFilterOpen: false,
      sortOptionsOpen: false
    })
  },

  showSizeFilter() {
    this.setData({
      sizeFilterOpen: !this.data.sizeFilterOpen,
      priceFilterOpen: false,
      materialFilterOpen: false,
      sortOptionsOpen: false
    })
  },

  showSortOptions() {
    this.setData({
      sortOptionsOpen: !this.data.sortOptionsOpen,
      priceFilterOpen: false,
      materialFilterOpen: false,
      sizeFilterOpen: false
    })
  },

  // 切换筛选类型
  toggleFilterPanel() {
    this.setData({
      showFilterPanel: !this.data.showFilterPanel,
      sortOptionsVisible: false
    })
  },

  // 选择价格区间
  selectPriceRange(e) {
    const range = e.currentTarget.dataset.range
    this.setData({
      selectedPriceRange: this.data.selectedPriceRange === range ? '' : range
    })
  },

  // 选择材质
  selectMaterial(e) {
    const material = e.currentTarget.dataset.material
    this.setData({
      selectedMaterial: this.data.selectedMaterial === material ? '' : material
    })
  },

  // 选择尺寸
  selectSize(e) {
    const size = e.currentTarget.dataset.size
    this.setData({
      selectedSize: this.data.selectedSize === size ? '' : size
    })
  },

  // 切换排序选项显示
  toggleSortOptions() {
    this.setData({
      sortOptionsVisible: !this.data.sortOptionsVisible,
      showFilterPanel: false
    })
  },

  // 选择排序方式
  selectSort(e) {
    const sort = e.currentTarget.dataset.sort
    this.setData({
      currentSort: sort,
      sortOptionsVisible: false
    })
    this.applyFilters()
  },

  // 应用筛选和排序
  applyFilters() {
    // 重置商品列表
    this.setData({
      products: [],
      currentPage: 1,
      noMore: false
    })
    // 重新加载商品
    this.loadProducts()
  },

  // 收藏切换
  toggleFavorite(e) {
    const product = e.currentTarget.dataset.product
    const isFavorite = app.toggleFavorite(product)
    
    // 更新商品列表中的收藏状态
    const products = this.data.products.map(p => {
      if (p.id === product.id) {
        return { ...p, isFavorite }
      }
      return p
    })
    
    this.setData({ products })
  },

  // 对比切换
  toggleCompare(e) {
    const product = e.currentTarget.dataset.product
    const isComparing = app.addToCompare(product)
    
    if (isComparing) {
      const products = this.data.products.map(p => {
        if (p.id === product.id) {
          return { ...p, isComparing: true }
        }
        return p
      })
      
      this.setData({ products })
    }
  },

  // 跳转到购买链接
  goToBuy(e) {
    e.stop()  // 阻止事件冒泡
    const id = e.currentTarget.dataset.id
    const url = e.currentTarget.dataset.url
    wx.navigateToMiniProgram({
      appId: 'wx91d27dbf599dff74',  // 京东小程序的 appId
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
  },

  // 加载更多
  loadMore() {
    this.loadProducts()
  },

  // 重置筛选条件
  resetFilters() {
    this.setData({
      selectedPriceRange: '',
      selectedMaterial: '',
      selectedSize: '',
      hasActiveFilters: false
    })
  },

  // 确认筛选条件
  confirmFilters() {
    const hasActiveFilters = 
      this.data.selectedPriceRange !== '' ||
      this.data.selectedMaterial !== '' ||
      this.data.selectedSize !== ''
    
    this.setData({
      showFilterPanel: false,
      hasActiveFilters
    })
    this.applyFilters()
  },

  // 移除筛选条件
  removeFilter(e) {
    const type = e.currentTarget.dataset.type
    if (type === 'price') {
      this.setData({
        selectedPriceRange: '',
        hasActiveFilters: this.data.selectedMaterial !== '' || this.data.selectedSize !== ''
      })
    } else if (type === 'material') {
      this.setData({
        selectedMaterial: '',
        hasActiveFilters: this.data.selectedPriceRange !== '' || this.data.selectedSize !== ''
      })
    } else if (type === 'size') {
      this.setData({
        selectedSize: '',
        hasActiveFilters: this.data.selectedPriceRange !== '' || this.data.selectedMaterial !== ''
      })
    }
  },
})
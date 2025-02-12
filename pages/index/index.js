// index.js
const app = getApp()

Page({
  data: {
    products: [],
    currentPage: 1,
    pageSize: 10,
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
    
    // 排序选项
    sortOptions: [
      { text: '综合排序', value: 'default' },
      { text: '价格从低到高', value: 'price-asc' },
      { text: '价格从高到低', value: 'price-desc' },
      { text: '评分从高到低', value: 'rating-desc' },
      { text: '销量从高到低', value: 'sales-desc' }
    ],
    currentSort: { text: '综合排序', value: 'default' },
    
    // 涂层和深度选项
    coatings: [
      '不粘涂层',
      '钛晶涂层',
      '麦饭石涂层',
      '陶瓷涂层',
      '纳米涂层',
      '石墨烯涂层'
    ],
    depths: [
      '7.0cm以下',
      '7.0-8.0cm',
      '8.1-9.0cm',
      '9.1cm以上'
    ],
    selectedCoating: '',
    selectedDepth: '',
    
    // 样例商品数据
    sampleProducts: [
      {
        id: "1",
        name: "苏泊尔不粘锅炒锅",
        price: 199.00,
        rating: 4.8,
        brand: "苏泊尔",
        specs: {
          material: "铝",
          coating: "不粘涂层",
          diameter: "28cm",
          depth: "8.5cm"
        },
        thumbnail: "images/placeholder.png",
        buyLink: "pages/product/product?sku=100009082466",
        sales: 1000,
        isFavorite: false
      },
      {
        id: "2",
        name: "九阳炒锅不粘锅",
        price: 159.00,
        rating: 4.6,
        brand: "九阳",
        specs: {
          material: "铝",
          coating: "钛晶涂层",
          diameter: "26cm",
          depth: "7.8cm"
        },
        thumbnail: "images/placeholder.png",
        buyLink: "pages/product/product?sku=100009082467",
        sales: 800,
        isFavorite: false
      }
    ]
  },

  onLoad() {
    this.loadProducts();
  },

  loadProducts() {
    const { currentPage, pageSize } = this.data;
    const allProducts = getApp().globalData.products;
    
    // 模拟分页加载
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const newProducts = allProducts.slice(start, end);

    if (newProducts.length === 0) {
      this.setData({ noMore: true });
      return;
    }

    // 获取收藏状态
    const favorites = wx.getStorageSync('favorites') || [];
    const productsWithFavorite = newProducts.map(product => ({
      ...product,
      isFavorite: favorites.some(f => f.id === product.id)
    }));

    this.setData({
      products: [...this.data.products, ...productsWithFavorite],
      currentPage: currentPage + 1
    });
  },

  // 下拉加载更多
  onReachBottom() {
    if (!this.data.noMore && !this.data.loading) {
      this.loadProducts();
    }
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
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      currentSort: sort,
      sortOptionsVisible: false
    });
    
    // 执行排序
    this.sortProducts(sort.value);
  },

  // 排序商品
  sortProducts(sortType) {
    const products = [...this.data.products];
    
    switch (sortType) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales-desc':
        products.sort((a, b) => b.sales - a.sales);
        break;
      default:
        // 综合排序，可以根据多个因素加权
        products.sort((a, b) => {
          const scoreA = a.rating * 0.4 + a.sales * 0.4 + (1000 - a.price) * 0.2;
          const scoreB = b.rating * 0.4 + b.sales * 0.4 + (1000 - b.price) * 0.2;
          return scoreB - scoreA;
        });
    }
    
    this.setData({ products });
  },

  // 应用筛选和排序
  applyFilters() {
    // 重置数据
    this.setData({
      currentPage: 1,
      products: [],
      noMore: false
    });
    
    // 重新加载数据
    this.loadProducts();
  },

  // 收藏切换
  toggleFavorite(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    const product = e.currentTarget.dataset.product;
    const isFavorite = app.toggleFavorite(product);
    
    // 更新页面显示
    const products = this.data.products.map(p => {
      if (p.id === product.id) {
        return { ...p, isFavorite };
      }
      return p;
    });
    
    this.setData({ products });
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
    if (e && e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.preventDefault && e.preventDefault();
    }
    
    const url = e.currentTarget.dataset.url;
    wx.navigateToMiniProgram({
        appId: 'wx91d27dbf599dff74',  // 京东小程序的 appId
        path: url,
        success(res) {
            console.log('跳转成功');
        },
        fail(res) {
            wx.showToast({
                title: '跳转失败',
                icon: 'none'
            });
        }
    });
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

  // 更新筛选逻辑以包含涂层和深度
  filterProducts(products) {
    let filteredProducts = products;
    
    // 应用材质筛选
    if (this.hasSelectedOptions('material')) {
      filteredProducts = filteredProducts.filter(product => 
        this.getSelectedValues('material').includes(product.specs.material)
      );
    }
    
    // 应用尺寸筛选
    if (this.hasSelectedOptions('size')) {
      filteredProducts = filteredProducts.filter(product => 
        this.getSelectedValues('size').includes(product.specs.diameter)
      );
    }
    
    // 应用涂层筛选
    if (this.hasSelectedOptions('coating')) {
      filteredProducts = filteredProducts.filter(product => 
        this.getSelectedValues('coating').includes(product.specs.coating)
      );
    }
    
    // 应用深度筛选
    if (this.hasSelectedOptions('depth')) {
      filteredProducts = filteredProducts.filter(product => 
        this.getSelectedValues('depth').includes(product.specs.depth)
      );
    }
    
    return filteredProducts;
  },

  hasSelectedOptions(option) {
    return this.data[`${option}FilterOpen`] || this.data[`${option}FilterOpen`] === false;
  },

  getSelectedValues(option) {
    return this.data[`${option}FilterOpen`] === true ? this.data[option] : [];
  },

  // 在页面显示时重新加载收藏状态
  onShow() {
    const favorites = app.globalData.favorites;
    const products = this.data.products.map(product => ({
      ...product,
      isFavorite: favorites.some(f => f.id === product.id)
    }));
    
    this.setData({ products });
  }
})
const products = [
  {
    id: 1,
    name: "九阳炒锅不粘锅",
    price: 159,
    thumbnail: "https://img14.360buyimg.com/n0/jfs/t1/58430/8/27080/168578/644a1a91F66a79e26/c29b74722460e5f1.jpg",
    specs: {
      diameter: "26cm",
      material: "铝",
      coating: "钛晶涂层",
      depth: "8cm"
    },
    rating: 4.6,
    sales: 800,
    buyLink: "pages/detail/detail?id=1"
  },
  {
    id: 2,
    name: "苏泊尔不粘锅炒锅",
    price: 199,
    thumbnail: "https://img14.360buyimg.com/n0/jfs/t1/58430/8/27080/168578/644a1a91F66a79e26/c29b74722460e5f1.jpg",
    specs: {
      diameter: "28cm",
      material: "铝",
      coating: "不粘涂层",
      depth: "8.5cm"
    },
    rating: 4.8,
    sales: 1000,
    buyLink: "pages/detail/detail?id=2"
  },
  {
    id: 3,
    name: "爱仕达麦饭石炒锅",
    price: 179,
    thumbnail: "https://img14.360buyimg.com/n0/jfs/t1/58430/8/27080/168578/644a1a91F66a79e26/c29b74722460e5f1.jpg",
    specs: {
      diameter: "30cm",
      material: "不锈钢",
      coating: "麦饭石涂层",
      depth: "9.2cm"
    },
    rating: 4.7,
    sales: 750,
    buyLink: "pages/detail/detail?id=3"
  },
  {
    "id": "4",
    "name": "美的麦饭石不粘锅",
    "price": 229.00,
    "rating": 4.9,
    "brand": "美的",
    "specs": {
      "material": "铝",
      "coating": "麦饭石涂层",
      "diameter": "28cm",
      "depth": "8.8cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082469",
    "sales": 1200
  },
  {
    "id": "5",
    "name": "炊大皇炒锅",
    "price": 168.00,
    "rating": 4.5,
    "brand": "炊大皇",
    "specs": {
      "material": "铸铁",
      "coating": "陶瓷涂层",
      "diameter": "32cm",
      "depth": "9.5cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082470",
    "sales": 600
  },
  {
    "id": "6",
    "name": "双立人炒锅",
    "price": 599.00,
    "rating": 4.9,
    "brand": "双立人",
    "specs": {
      "material": "不锈钢",
      "coating": "纳米涂层",
      "diameter": "30cm",
      "depth": "8.8cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082471",
    "sales": 300
  },
  {
    "id": "7",
    "name": "膳魔师不粘锅",
    "price": 329.00,
    "rating": 4.7,
    "brand": "膳魔师",
    "specs": {
      "material": "铝合金",
      "coating": "石墨烯涂层",
      "diameter": "28cm",
      "depth": "8.2cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082472",
    "sales": 450
  },
  {
    "id": "8",
    "name": "康宁炒锅",
    "price": 459.00,
    "rating": 4.8,
    "brand": "康宁",
    "specs": {
      "material": "复合底",
      "coating": "陶瓷涂层",
      "diameter": "26cm",
      "depth": "7.5cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082473",
    "sales": 380
  },
  {
    "id": "9",
    "name": "蒸烤王多功能炒锅",
    "price": 259.00,
    "rating": 4.6,
    "brand": "蒸烤王",
    "specs": {
      "material": "铝合金",
      "coating": "钛晶涂层",
      "diameter": "32cm",
      "depth": "9.8cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082474",
    "sales": 520
  },
  {
    "id": "10",
    "name": "拜格不粘锅",
    "price": 139.00,
    "rating": 4.4,
    "brand": "拜格",
    "specs": {
      "material": "铝",
      "coating": "不粘涂层",
      "diameter": "24cm",
      "depth": "7.2cm"
    },
    "thumbnail": "images/placeholder.png",
    "buyLink": "pages/product/product?sku=100009082475",
    "sales": 680
  }
];

// 生成更多商品数据
const brands = ['九阳', '苏泊尔', '爱仕达', '美的', '炊大皇', '双立人', '膳魔师', '康宁'];
const materials = ['铝', '不锈钢', '铸铁', '复合底'];
const coatings = ['不粘涂层', '钛晶涂层', '麦饭石涂层', '陶瓷涂层', '纳米涂层'];
const diameters = ['24cm', '26cm', '28cm', '30cm', '32cm'];

// 生成20个随机商品
for (let i = 4; i <= 20; i++) {
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const material = materials[Math.floor(Math.random() * materials.length)];
  const coating = coatings[Math.floor(Math.random() * coatings.length)];
  const diameter = diameters[Math.floor(Math.random() * diameters.length)];
  const price = Math.floor(Math.random() * (600 - 100) + 100); // 100-600之间的随机价格
  const rating = (Math.random() * (5 - 4) + 4).toFixed(1); // 4.0-5.0之间的随机评分
  const sales = Math.floor(Math.random() * (2000 - 300) + 300); // 300-2000之间的随机销量
  const depth = (Math.random() * (10 - 7) + 7).toFixed(1) + 'cm'; // 7.0-10.0cm之间的随机深度

  products.push({
    id: i,
    name: `${brand}${coating}炒锅`,
    price: price,
    thumbnail: "https://img14.360buyimg.com/n0/jfs/t1/58430/8/27080/168578/644a1a91F66a79e26/c29b74722460e5f1.jpg",
    specs: {
      diameter: diameter,
      material: material,
      coating: coating,
      depth: depth
    },
    rating: parseFloat(rating),
    sales: sales,
    buyLink: `pages/detail/detail?id=${i}`
  });
}

module.exports = products; 
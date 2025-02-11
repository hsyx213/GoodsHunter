// index.js
Page({
  data: {
    materials: ['全部', '铝合金', '不锈钢', '铸铁'],
    selectedMaterial: '全部',
    diameter: 30,
    pans: [
      { id: 1, title: '不粘锅A', diameter: 30, price: 199 },
      { id: 2, title: '不粘锅B', diameter: 32, price: 299 }
    ]
  },
  setMaterial(e) {
    this.setData({
      selectedMaterial: this.data.materials[e.detail.value]
    });
  },
  setDiameter(e) {
    this.setData({ diameter: e.detail.value });
  }
});
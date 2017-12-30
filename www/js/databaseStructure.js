menu = {
  category: 'beverage/starter/dessert/mainCourse',
  name: 'whatever',
  price: 100,
  inStock: true,
  analytics: {
    totalOrders: 99
  }
};

users = {
  username: "nakulh",
  password: "sdcfvgbhjnkl",
  permissions: {}
};

tables = {
  number: 1,
  customer: "nakul",
  occupiedTimestamp: new Date(),
  analytics: {
    totalCustomers: 10
  }
};

customers = {
  name: "nakul",
  inTime: new Date(),
  outTime: new Date(),
  billedOrders: [{
    name: "paneer",
    price: 100,
    timeInKitchen: new Date()
  }],
};

kitchen = {
  name: "paneer",
  modifiers: "extra spicy",
  rush: false,
  inTime: new Date()
};

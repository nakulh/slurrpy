menu = {
  category: 'beverage/starter/dessert/mainCourse',
  name: 'whatever',
  price: 100,
  inStock: true,
  shortName: "srtNme",
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
  firstName: "Nakul",
  lastName: "Havelia",
  occupiedTimestamp: new Date(),
  order: [],
  count: 1,
  analytics: {
    totalCustomers: 10
  }
};

customers = {
  firstName: "Nakul",
  lastName: "Havelia",
  occupiedTimestamp: new Date(),
  unseatTimestamp: new Date(),
  count: 1,
  order: [{
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

orderHistory = {
  items: [],
  inTime: new Date(),
  outTime: new Date()
};

walkins = {
  order: [],
  inTime: new Date()
};

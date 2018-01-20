/*jshint esversion: 6 */
const $ = require('jquery');
menuManager = {};
menuManager.do = {};
menuManager.do.getFullMenu = () => {
  return new Promise((res, rej) => {
    menuData = {};
    db.do.getCategories().then((categories) => {
      for(let category in categories){
        catg = categories[category];
        menuData[catg] = {'name': catg, items: {}};
      }
      console.log(menuData);
      db.do.getAllMenuItems().then((menuItems) => {
        //process menu items according to yasho's (really really) shitty way
        for(let x = 0; x < menuItems.length; x++){
          c = menuItems[x].category;
          menuData[c].items[menuItems[x]._id] = {
            name: menuItems[x].name,
            price: menuItems[x].price,
            'short name': menuItems[x].shortName,
            serving: menuItems[x].inStock ? 'checked' : ''
          };
        }
        res(menuData);
      });
    });
  });
};

menuManager.do.addCategory = (category) => {
  return new Promise((res, rej) => {
    db.do.addCategory(category).then(() => {
      res('category added');
    });
  });
};

menuManager.do.deleteCategory = (category) => {
  return new Promise((res, rej) => {
    db.do.deleteCategory(category).then(() => {
      res('category deleted');
    });
  });
};

menuManager.do.addItem = (item) => {
  return new Promise((res, rej) => {
    db.do.addMenuItem(item).then((id) => {
      res(id);
    });
  });
};

menuManager.do.editItem = (item, id) => {
  return new Promise((res, rej) => {
    db.do.editMenuItem(item, id).then(() => {
      res('item edited');
    });
  });
};

menuManager.do.deleteItem = (id) => {
  return new Promise((res, rej) => {
    db.do.deleteMenuItem(id).then(() => {
      res('item deleted');
    });
  });
};

menuManager.do.toggleItemServing = (id, isServing) => {
  return new Promise((res, rej) => {
    db.do.toggleItemServing(id, isServing).then(() => {
      res('item toggled');
    });
  });
};

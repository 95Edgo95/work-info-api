const ids = {
  development: {
    uniqueService: "1chgi9",
    workbookService: "tlswx",
    workplaceService: "w1oht",
  },
  production: {
    uniqueService: "12kxv1",
    workbookService: "13rt2l",
    workplaceService: "z0c8d",
  }
};

export default ids[process.env.NODE_ENV || "development"];

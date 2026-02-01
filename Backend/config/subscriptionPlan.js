const SUBSCRIPTION_PLAN = {
  FREE: {
    price: 0,
    limit: 1,
  },
  BRONZE: {
    price: 100,
    limit: 3,
  },
  SILVER: {
    price: 300,
    limit: 5,
  },
  GOLD: {
    price: 1000,
    limit: 999999,
  },
};

module.exports = SUBSCRIPTION_PLAN;

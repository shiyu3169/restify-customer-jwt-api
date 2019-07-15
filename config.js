module.exports = {
  ENV: process.env.NODE_ENV || 'develipment',
  PORT: process.env.PORT || 3000,
  URL: process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://admin:cliff92711@cluster0-0qtdb.mongodb.net/test?retryWrites=true&w=majority'
};

const errors = require('restify-errors');
const rjwt = require('restify-jwt-community');
const Customer = require('../models/Customer');
const config = require('../config');

module.exports = server => {
  // Get Customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is not customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // Get Single Customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customers = await Customer.findById(req.params.id);
      res.send(customers);
      next();
    } catch (err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Add Customer
  server.post(
    '/customers',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      const { name, email, balance } = req.body;

      const customer = new Customer({
        name,
        email,
        balance
      });

      try {
        await customer.save();
        res.send(201);
        next();
      } catch (err) {
        return next(new errors.InternalError(err.message));
      }
    }
  );

  // Update Customer
  server.put(
    '/customers/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      // Check for JSON
      if (!req.is('application/json')) {
        return next(
          new errors.InvalidContentError("Expects 'application/json'")
        );
      }

      try {
        await Customer.findOneAndUpdate({ _id: req.params.id }, req.body);
        res.send(200);
        next();
      } catch (err) {
        return next(
          new errors.ResourceNotFoundError(
            `There is not customer with the id of ${req.params.id}`
          )
        );
      }
    }
  );

  // Delete Customer
  server.del(
    '/customers/:id',
    rjwt({ secret: config.JWT_SECRET }),
    async (req, res, next) => {
      try {
        await Customer.findOneAndRemove({ _id: req.params.id });
        res.send(204);
      } catch (err) {
        new errors.ResourceNotFoundError(
          `There is not customer with the id of ${req.params.id}`
        );
      }
    }
  );
};

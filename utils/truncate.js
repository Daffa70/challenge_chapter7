const { Component } = require("../db/models");

module.exports = {
  component: async () => {
    await Component.destroy({ truncate: true, restartIdentity: true });
  },
};

'use strict';
    // positionId: DataTypes.STRING
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@gmail.com',
        password: '123456',
        firstName: 'Tran',
        lastName: 'Toan',
        address: 'Thai_Binh',
        phonenumber: '0363870102',
        gender: '1',
        image: null,
        roleId: 'ADMIN',
        positionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};

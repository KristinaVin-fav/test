import sequelize from '../sequelize.js'
import database from 'sequelize'
const {DataTypes} = database
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    surname: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    pass: { type: DataTypes.STRING, allowNull: false },
  });
  const Staff = sequelize.define('staff', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    surname: { type: DataTypes.STRING, allowNull: false },
    nameg: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    rank: { type: DataTypes.STRING, allowNull: false },
    mob: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    pass: { type: DataTypes.STRING, allowNull: false },
  });
  const Uslugi = sequelize.define('uslugi', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
  });
  const Admin = sequelize.define('admins', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
});
  const Request = sequelize.define('request', {
    date: {
      type: DataTypes.DATEONLY, 
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
  },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Новая' 
    },
    wish: DataTypes.STRING,
    address: DataTypes.STRING,
    time: DataTypes.TIME, 
    timeout: DataTypes.TIME, 
    user_id: DataTypes.INTEGER, 
    UslugaId: DataTypes.INTEGER, 
    paymentType: {
      type: DataTypes.ENUM('cash', 'card'), 
      allowNull: false, },

  });
  Request.belongsTo(User, { foreignKey: 'user_id' }); 
  User.hasMany(Request, { foreignKey: 'user_id' }); 
  Uslugi.hasMany(Request, { foreignKey: 'UslugaId' }); 
  Request.belongsTo(Uslugi, { foreignKey: 'UslugaId' }); 
export { User as UserMapping };
export { Staff as StaffMapping };
export { Request as RequestMapping };
export {
    User, 
    Staff,
    Uslugi,
    Request,
    Admin,
}
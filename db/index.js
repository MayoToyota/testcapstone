const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'intrapreneurship',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        dialect: process.env.DB_DIALECT || 'mariadb',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: {
            options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
            },
        },
    }
);

sequelize.authenticate().then(
    () => {
        console.log('succesfully connected.');
    },
    () => {
        console.log('failed to connect.');
    }
);
let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/user.model')(db);
db.Idea = require('../models/idea.model')(db);
db.Participant = require('../models/participant.model')(db);
db.Comment = require('../models/comment.model')(db);

db.User.hasMany(db.Idea);
db.Idea.belongsTo(db.User);

db.Idea.hasMany(db.Participant);
db.Participant.belongsTo(db.Idea);

db.Idea.hasMany(db.Comment);
db.Comment.belongsTo(db.Idea);

sequelize.sync();

module.exports = db;

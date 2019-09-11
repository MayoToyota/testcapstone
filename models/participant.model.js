module.exports = db => {
    const Participant = db.sequelize.define('participant', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: db.Sequelize.STRING,
        },
        email: {
            type: db.Sequelize.STRING,
        },
        position: {
            type: db.Sequelize.STRING,
        },
        reason: {
            type: db.Sequelize.STRING,
        },
    });

    return Participant;
};

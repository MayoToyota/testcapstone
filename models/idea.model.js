module.exports = db => {
    const Idea = db.sequelize.define('idea', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        summary: {
            type: db.Sequelize.STRING,
        },
        description: {
            type: db.Sequelize.TEXT,
        },
        initialCost: {
            type: db.Sequelize.INTEGER,
        },
        runningCost: {
            type: db.Sequelize.INTEGER,
        },
        numberOfParticipant: {
            type: db.Sequelize.INTEGER,
        },
        goalYears: {
            type: db.Sequelize.INTEGER,
        },
    });

    return Idea;
};

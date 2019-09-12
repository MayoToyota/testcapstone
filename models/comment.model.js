module.exports = db => {
    const Comment = db.sequelize.define('comment', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: db.Sequelize.TEXT,
        },
    });

    return Comment;
};

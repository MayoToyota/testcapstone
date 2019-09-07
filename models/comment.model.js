module.exports = (db) => {

    const Comment = db.sequelize.define('comment', {
        id: {
            type: db.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: db.Sequelize.STRING,
        }
    });

    return Comment;
 };
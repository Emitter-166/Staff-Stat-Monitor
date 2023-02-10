import { Sequelize, INTEGER, CHAR } from "sequelize";

export const model = (sequelize: Sequelize) => {
    sequelize.define('stats', {
       userId: {
        type: CHAR(50),
        allowNull: false
       },
       date: {
        type: CHAR(20),
        allowNull: false
       },
       msg: {
        type: INTEGER,
        defaultValue: 0
       }
    }, {
        timestamps: false,
        indexes: [
            {fields: ['userId', 'date']}
        ]
    })
}
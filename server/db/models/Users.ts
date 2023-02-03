import * as sequelize from 'sequelize-typescript'

@sequelize.Table({
  timestamps: false,
  tableName: 'users',
})
export class Users extends sequelize.Model {
  @sequelize.Column({
    type: sequelize.DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @sequelize.Column({
    type: sequelize.DataType.STRING,
    allowNull: false,
    unique: true
  })
  nickname!: string

  @sequelize.Column({
    type: sequelize.DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string

  @sequelize.Column({})
  password!: string

  @sequelize.Column({
    type: sequelize.DataType.STRING,
  })
  avatarUrl!: string
}

import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from "sequelize-typescript"
import { Items } from "./Items"
import { Users } from "./Users"

@Table({ timestamps: false, tableName: 'likes', indexes: [{ unique: true, fields: ['itemId', 'userId'] }] })
export class Likes extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @ForeignKey(() => Users)
  @Column
  userId!: number

  @ForeignKey(() => Items)
  @Column
  itemId!: number

  @Index({ unique: true })

  @BelongsTo(() => Users)
  users!: Users

  @BelongsTo(() => Items)
  items!: Items
}


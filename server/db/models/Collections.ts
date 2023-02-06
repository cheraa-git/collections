import { Table, Column, DataType, ForeignKey, BelongsTo, Model, HasMany } from "sequelize-typescript"

import { Users } from "./Users"
import { Items } from "./Items"
import { ItemConfigs } from "./ItemConfigs"


@Table({ timestamps: false, tableName: 'collections' })
export class Collections extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string

  @Column({ type: DataType.TEXT })
  description!: string

  @Column({ type: DataType.STRING })
  theme!: string

  @Column({ type: DataType.STRING })
  imageUrl!: string

  @BelongsTo(() => Users)
  users!: Users

  @HasMany(() => Items)
  items!: Items[]

  @HasMany(() => ItemConfigs)
  itemConfigs!: ItemConfigs[]
}

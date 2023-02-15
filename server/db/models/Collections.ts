import { Table, Column, DataType, ForeignKey, BelongsTo, Model, HasMany } from "sequelize-typescript"

import { Users } from "./Users"
import { Items } from "./Items"
import { ItemConfigs } from "./ItemConfigs"
import { Themes } from "./Themes"


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

  @ForeignKey(() => Themes)
  @Column
  themeId!: number

  @Column({ type: DataType.STRING })
  imageUrl!: string

  @Column({ type: DataType.STRING, allowNull: false })
  timestamp!: string

  @BelongsTo(() => Themes)
  themes!: Themes

  @BelongsTo(() => Users)
  users!: Users

  @HasMany(() => Items, { onDelete: 'cascade' })
  items!: Items[]

  @HasMany(() => ItemConfigs, { onDelete: 'cascade' })
  itemConfigs!: ItemConfigs[]
}

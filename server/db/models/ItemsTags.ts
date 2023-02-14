import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Items } from "./Items"
import { Tags } from "./Tags"


@Table({timestamps: false, tableName: 'items_tags'})
export class ItemsTags extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @ForeignKey(() => Items)
  @Column
  itemId!: number

  @ForeignKey(() => Tags)
  @Column
  tagId!: number
}

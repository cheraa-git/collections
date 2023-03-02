import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript"
import { Items } from "./Items"
import { ItemsTags } from "./ItemsTags"

@Table({ timestamps: false, tableName: 'tags' })
export class Tags extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string

  @BelongsToMany(() => Items, () => ItemsTags)
  items!: Items[]
}

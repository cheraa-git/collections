import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Collections } from "./Collections"

@Table({ timestamps: false, tableName: 'item_configs' })
export class ItemConfigs extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @ForeignKey(() => Collections)
  @Column
  collectionId!: number

  @Column({ type: DataType.STRING, allowNull: false })
  type!: string

  @Column({ type: DataType.STRING, allowNull: false })
  label!: string

  @Column({ type: DataType.BOOLEAN })
  hidden!: boolean

  @BelongsTo(() => Collections)
  collections!: Collections
}

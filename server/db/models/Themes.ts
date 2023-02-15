import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript"
import { Collections } from "./Collections"

@Table({ timestamps: false, tableName: 'themes' })
export class Themes extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string

  @HasMany(() => Collections)
  collections!: Collections[]
}

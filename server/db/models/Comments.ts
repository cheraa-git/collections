import {
  AfterBulkDestroy,
  AfterCreate,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from "sequelize-typescript"
import { Users } from "./Users"
import { Items } from "./Items"
import { addCommentIndex, removeCommentIndex } from "../../service/searchService"

@Table({ timestamps: false, tableName: 'comments' })
export class Comments extends Model {
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

  @Column({ type: DataType.STRING, allowNull: false })
  text!: string

  @Column({ type: DataType.STRING, allowNull: false })
  timestamp!: string

  @BelongsTo(() => Users)
  users!: Users

  @BelongsTo(() => Items)
  items!: Items

  @AfterCreate
  static afterCreateHook(instance: Comments) {
    addCommentIndex(instance)
  }

  @AfterBulkDestroy
  static afterBulkDestroyHook(options: any): void {
    removeCommentIndex(options.where.id)
  }
}

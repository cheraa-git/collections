import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Collections } from "./Collections"
import { Tags } from "./Tags"
import { ItemsTags } from "./ItemsTags"
import { Comments } from "./Comments"


@Table({ timestamps: false, tableName: 'items' })
export class Items extends Model {
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
  name!: string

  @Column({ type: DataType.STRING, allowNull: false })
  timestamp!: string

  @Column({ type: DataType.STRING })
  str1!: string

  @Column({ type: DataType.STRING })
  str2!: string

  @Column({ type: DataType.STRING })
  str3!: string

  @Column({ type: DataType.TEXT })
  txt1!: string

  @Column({ type: DataType.TEXT })
  txt2!: string

  @Column({ type: DataType.TEXT })
  txt3!: string

  @Column({ type: DataType.DECIMAL })
  numb1!: number

  @Column({ type: DataType.DECIMAL })
  numb2!: number

  @Column({ type: DataType.DECIMAL })
  numb3!: number

  @Column({ type: DataType.BOOLEAN })
  bool1!: boolean

  @Column({ type: DataType.BOOLEAN })
  bool2!: boolean

  @Column({ type: DataType.BOOLEAN })
  bool3!: boolean

  @Column({ type: DataType.DATE })
  date1!: string

  @Column({ type: DataType.DATE })
  date2!: string

  @Column({ type: DataType.DATE })
  date3!: string

  @BelongsTo(() => Collections)
  collections!: Collections

  @BelongsToMany(() => Tags, () => ItemsTags)
  tags!: Tags[]

  @HasMany(() => Comments, {onDelete: 'cascade'})
  comments!: Comments[]
}

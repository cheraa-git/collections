import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript"
import { Collections } from "./Collections"
import { Comments } from "./Comments"
import { Likes } from "./Likes"
import { UserStatus } from "../../../../common/types/user"


@Table({ timestamps: false, tableName: 'users' })
export class Users extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  nickname!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string

  @Column({ type: DataType.STRING })
  password!: string

  @Column({ type: DataType.STRING, })
  avatarUrl!: string

  @Column({ type: DataType.BOOLEAN, })
  isAdmin!: boolean

  @Column({ type: DataType.STRING, })
  status!: UserStatus

  @HasMany(() => Collections, { onDelete: 'cascade' })
  collections!: Collections[]

  @HasMany(() => Comments, {onDelete: 'cascade'})
  comments!: Comments[]

  @HasMany(() => Likes, {onDelete: 'cascade'})
  likes!: Likes[]
}

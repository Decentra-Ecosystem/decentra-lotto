import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TaskEth extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public txHash: string

  @column()
  public to: string

  @column()
  public amount: string

  @column()
  public status: number

  @column()
  public blockNumber: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TaskEths extends BaseSchema {
  protected tableName = 'task_eths'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('tx_hash').unique()
      table.string('to')
      table.string('amount')
      table.integer('status')
      table.integer('block_number').unsigned()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

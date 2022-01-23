import {ColumnType} from 'typeorm/driver/types/ColumnTypes';


export type ModelDefinition = {
  name: string,
  tableName: string,
  schema: string,
  fields: Array<{
    name: string,
    dbType: ColumnType | string,
    dbColumnName: string,
    isPrimary: boolean,
    isNullable: boolean,
    isUnique: boolean
  }>
  constraints: Array<{
    type: string,
    name: string,
    columns: Array<{ name: string, dbColumnName: string }>
  }>
  relations: Array<{
    fromModel: string,
    fields: string[],
    referencedModel: string,
    references: string[]
    key?: string,
    type: string,
    name: string,
    onUpdate?: string,
    onDelete?: string
  }>,
}

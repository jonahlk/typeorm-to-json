import {ColumnType} from 'typeorm/driver/types/ColumnTypes';
import {TableType} from 'typeorm/metadata/types/TableTypes';


export type ModelDefinition = {
  name: string,
  tableName: string,
  type: TableType,
  schema: string,
  fields: Array<{
    name: string,
    dbType: ColumnType | string,
    dbColumnName: string,
    isArray: boolean,
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

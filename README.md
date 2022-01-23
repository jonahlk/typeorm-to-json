# Description
This package allows to generate an object of all entities that are registered to the current typeorm connection.

It is required to pass the typeorm connection object in the first argument.

# Installation
```
npm install typeorm-to-json
```

#Usage

###Import
```typescript
const {generateObjectFromTypeormEntities} = require('typeorm-to-json')
```
or
```typescript
import {generateObjectFromTypeormEntities} from'typeorm-to-json'
```

###Use 
```typescript
const typeormConnection = await createConnection();
const models = await generateObjectFromTypeormEntities(typeormConnection)
```

The `generateObjectFromTypeormEntities`  will return an array of `ModelDefinition[]`:
```typescript
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
```
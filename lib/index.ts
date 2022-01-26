import {Connection} from 'typeorm';
import {addColumns, addCompositePrimaryKeys, addOneToXRelations, addUniqueConstraints, createOneToManyRelations} from './actions';
import {ModelDefinition} from './types';


export const generateObjectFromTypeormEntities = async (typeorm: Connection): Promise<ModelDefinition[]> => {

  const formattedEntities: ModelDefinition[] = [];

  for (const _entity of typeorm.entityMetadatas) {

    const formattedModel: ModelDefinition = {
      name: _entity.name,
      type: _entity.tableType,
      schema: _entity.schema,
      tableName: _entity.tableName,
      fields: [],
      constraints: [],
      relations: [],
    };

    addUniqueConstraints(_entity, formattedModel);
    addCompositePrimaryKeys(_entity, formattedModel);
    addColumns(_entity, formattedModel);
    addOneToXRelations(_entity, formattedModel);

    formattedEntities.push(formattedModel);
  }

  createOneToManyRelations(formattedEntities);
  return formattedEntities;
};



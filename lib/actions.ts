import Case from 'case';
import * as pluralize from 'pluralize';
import {ModelDefinition} from './types';


export const addUniqueConstraints = (_entity, formattedModel: ModelDefinition) => {
  for (const _uniqueConstraint of _entity.uniques) {
    formattedModel.constraints.push({
      type: 'unique',
      name: _uniqueConstraint.name,
      columns: _uniqueConstraint.columns.map(column => ({name: column.propertyName, dbColumnName: column.givenDatabaseName})),
    })
  }
}

export const addCompositePrimaryKeys = (_entity, formattedModel: ModelDefinition) => {
  if(_entity.hasMultiplePrimaryKeys) {
    formattedModel.constraints.push({
      type: 'primary',
      name: '',
      columns: _entity.primaryColumns.map(column => ({name: column.propertyName, dbColumnName: ''}))
    })
  }
}

export const addColumns = (_entity, formattedModel: ModelDefinition) => {
  for (const _column of _entity.columns) {
    const {isPrimary, isNullable, propertyName, givenDatabaseName, type} = _column
    const uniqueConstraint = formattedModel.constraints.find(constraint => constraint.type === 'unique')
    const isUnique = uniqueConstraint?.columns.length === 1 && uniqueConstraint.columns[0].name === propertyName

    if (isUnique) { /* Remove unique constraint from model if added to the column */
      const uniqueConstraintIndex = formattedModel.constraints.indexOf(uniqueConstraint);
      formattedModel.constraints.splice(uniqueConstraintIndex, 1);
    }

    formattedModel.fields.push({
      name: propertyName,
      dbColumnName: givenDatabaseName,
      dbType: typeof type === 'function' ? 'integer': type ||  'Unsupported("ViewColumn")',
      isPrimary: _entity.hasMultiplePrimaryKeys ? false : isPrimary,
      isNullable,
      isUnique
    })
  }
}

export const addOneToXRelations = (_entity, formattedModel: ModelDefinition) => {
  for (const _relation of _entity.relations) {
    const {relationType, onUpdate, onDelete, foreignKeys, propertyName, isOneToOneOwner} = _relation
    const isHasMany = relationType === 'one-to-many'
    const isHasOne = relationType === 'one-to-one'

    let key = ''
    if(isOneToOneOwner) {
      key = propertyName
    }
    else if (isHasMany || isHasOne) {
      key = _relation.inverseSidePropertyPath
    }
    else {
      key = propertyName
    }

    formattedModel.relations.push({
      name: propertyName,
      fromModel: _relation.target.toString().match(/\w+/g)[1],
      key,
      type: relationType,
      referencedModel: _relation.type.toString().match(/\w+/g)[1],
      fields: isHasMany || isHasOne ? [] : foreignKeys[0].columns.map(column => column.propertyName),
      references: isHasMany || isHasOne ? [] : foreignKeys[0].referencedColumns.map(column => column.propertyName),
      onDelete,
      onUpdate,
    })
  }
}

export const createOneToManyRelations = (formattedEntities: ModelDefinition[]) => {
  /* Loop through all relations and create inverted ManyToOne relation */
  const relations = []
  formattedEntities.forEach(entity => relations.push(...entity.relations))
  const manyToOneRelations = relations.filter(relation => relation.type === 'many-to-one')

  for (const _manyToOneRelation of manyToOneRelations) {
    const currentEntity = formattedEntities.find(entity => entity.name === _manyToOneRelation.referencedModel)
    const currentReferencedModels = currentEntity.relations.map(relation => relation.referencedModel)
    if(currentReferencedModels.includes(_manyToOneRelation.fromModel)){
      continue;
    }

    const name = Case.camel(pluralize.plural(_manyToOneRelation.fromModel))
    const oneToManyRelation = {
      name,
      fromModel: _manyToOneRelation.referencedModel,
      referencedModel: _manyToOneRelation.fromModel,
      key: _manyToOneRelation.key,
      type: 'one-to-many',
      fields: [],
      references: []
    }
    let currEntity = formattedEntities.find(entity => entity.name === _manyToOneRelation.referencedModel)
    currEntity.relations = [...currEntity.relations, oneToManyRelation]
  }

}

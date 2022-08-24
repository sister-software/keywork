/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

import Handlebars from 'handlebars'
import {
  ArrayType,
  ConditionalType,
  DeclarationReflection,
  IndexedAccessType,
  InferredType,
  IntersectionType,
  IntrinsicType,
  LiteralType,
  PredicateType,
  QueryType,
  ReferenceType,
  ReflectionType,
  SignatureReflection,
  TupleType,
  TypeOperatorType,
  UnionType,
  UnknownType,
} from 'typedoc'
import { escapeChars } from '../../utils.ts'

type Collapse = 'object' | 'function' | 'all' | 'none'

export default function () {
  Handlebars.registerHelper(
    'type',
    function (
      this:
        | ArrayType
        | IntersectionType
        | IntrinsicType
        | ReferenceType
        | TupleType
        | UnionType
        | TypeOperatorType
        | QueryType
        | PredicateType
        | ReferenceType
        | ConditionalType
        | IndexedAccessType
        | UnknownType
        | InferredType,

      collapse: Collapse = 'none',
      emphasis = true
    ) {
      if (this instanceof ReferenceType) {
        return getReferenceType(this, emphasis).trim()
      }

      if (this instanceof ArrayType && this.elementType) {
        return getArrayType(this, emphasis).trim()
      }

      if (this instanceof UnionType && this.types) {
        return getUnionType(this, emphasis).trim()
      }

      if (this instanceof IntersectionType && this.types) {
        return getIntersectionType(this).trim()
      }

      if (this instanceof TupleType && this.elements) {
        return getTupleType(this).trim()
      }

      if (this instanceof IntrinsicType && this.name) {
        return getIntrinsicType(this, emphasis).trim()
      }

      if (this instanceof ReflectionType) {
        return getReflectionType(this, collapse).trim()
      }

      if (this instanceof DeclarationReflection) {
        return getReflectionType(this, collapse).trim()
      }

      if (this instanceof TypeOperatorType) {
        return getTypeOperatorType(this).trim()
      }

      if (this instanceof QueryType) {
        return getQueryType(this).trim()
      }

      if (this instanceof ConditionalType) {
        return getConditionalType(this).trim()
      }

      if (this instanceof IndexedAccessType) {
        return getIndexAccessType(this).trim()
      }

      if (this instanceof UnknownType) {
        return getUnknownType(this).trim()
      }

      if (this instanceof InferredType) {
        return getInferredType(this).trim()
      }

      if (this instanceof LiteralType) {
        return getLiteralType(this).trim()
      }

      const content = this?.toString() || ''

      if (collapse === 'all') {
        return '```ts\n' + content + '\n```'
      }

      return content
    }
  )
}

function getLiteralType(model: LiteralType) {
  if (typeof model.value === 'bigint') {
    return `\`${model.value}n\``
  }
  return `\`${JSON.stringify(model.value)}\``
}

export function getReflectionType(model: DeclarationReflection | ReflectionType, collapse: Collapse) {
  const root = model instanceof ReflectionType ? model.declaration : model
  if (root.signatures) {
    return collapse === 'function' || collapse === 'all' ? `\`fn\`` : getFunctionType(root.signatures)
  }
  return collapse === 'object' || collapse === 'all' ? `\`Object\`` : getDeclarationType(root)
}

function getDeclarationType(model: DeclarationReflection) {
  if (model.indexSignature || model.children) {
    let indexSignature = ''
    const declarationIndexSignature = model.indexSignature
    if (declarationIndexSignature) {
      const key = declarationIndexSignature.parameters
        ? declarationIndexSignature.parameters.map((param) => `\`[${param.name}: ${param.type}]\``)
        : ''
      const obj = Handlebars.helpers.type.call(declarationIndexSignature.type)
      indexSignature = `${key}: ${obj}; `
    }
    const types =
      model.children &&
      model.children.map((obj) => {
        return `\`${obj.name}${obj.flags.isOptional ? '?' : ''}\`: ${Handlebars.helpers.type.call(
          obj.signatures || obj.children ? obj : obj.type
        )} ${obj.defaultValue && obj.defaultValue !== '...' ? `= ${escapeChars(obj.defaultValue)}` : ''}`
      })
    return `{ ${indexSignature ? indexSignature : ''}${types ? types.join('; ') : ''} }${
      model.defaultValue && model.defaultValue !== '...' ? `= ${escapeChars(model.defaultValue)}` : ''
    }`
  }
  return '{}'
}

export function getFunctionType(modelSignatures: SignatureReflection[]) {
  const functions = modelSignatures.map((fn) => {
    const typeParams = fn.typeParameters
      ? `<${fn.typeParameters.map((typeParameter) => typeParameter.name).join(', ')}\\>`
      : []
    const params = fn.parameters
      ? fn.parameters.map((param) => {
          return `${param.flags.isRest ? '...' : ''}\`${param.name}${
            param.flags.isOptional ? '?' : ''
          }\`: ${Handlebars.helpers.type.call(param.type ? param.type : param)}`
        })
      : []
    const returns = Handlebars.helpers.type.call(fn.type)
    return typeParams + `(${params.join(', ')}) => ${returns}`
  })
  return functions.join('')
}

function getReferenceType(model: ReferenceType, emphasis: boolean) {
  const externalUrl = Handlebars.helpers.attemptExternalResolution(model)
  if (model.reflection || (model.name && model.typeArguments)) {
    const reflection: string[] = ['`']

    if (model.reflection?.url) {
      reflection.push(model.reflection.name)
    } else {
      reflection.push(model.name)
    }

    if (model.typeArguments && model.typeArguments.length > 0) {
      reflection.push(
        `<${model.typeArguments
          .map((typeArgument) => Handlebars.helpers.type.call(typeArgument, 'collapse', false))
          .join(', ')}>`
      )
    }

    reflection.push('`')

    if (model.reflection?.url) {
      reflection.unshift('[')
      reflection.push(`](${Handlebars.helpers.relativeURL(model.reflection.url)})`)
    }

    return reflection.join('')
  }

  return emphasis
    ? externalUrl
      ? `[${`\`${model.name}\``}]( ${externalUrl} )`
      : `\`${model.name}\``
    : escapeChars(model.name)
}

function getArrayType(model: ArrayType, emphasis: boolean) {
  const arrayType = Handlebars.helpers.type.call(model.elementType, 'none', emphasis)
  return model.elementType.type === 'union' ? `(${arrayType})[]` : `${arrayType}[]`
}

function getUnionType(model: UnionType, emphasis: boolean) {
  return model.types
    .map((unionType) => {
      return Handlebars.helpers.type.call(unionType, 'none', emphasis)
    })
    .join(` | `)
}

function getIntersectionType(model: IntersectionType) {
  return model.types.map((intersectionType) => Handlebars.helpers.type.call(intersectionType)).join(' & ')
}

function getTupleType(model: TupleType) {
  return `[${model.elements.map((element) => Handlebars.helpers.type.call(element)).join(', ')}]`
}

function getIntrinsicType(model: IntrinsicType, emphasis: boolean) {
  return emphasis ? `\`${model.name}\`` : model.name
}

function getTypeOperatorType(model: TypeOperatorType) {
  return `${model.operator} ${Handlebars.helpers.type.call(model.target)}`
}

function getQueryType(model: QueryType) {
  return `typeof ${Handlebars.helpers.type.call(model.queryType)}`
}

function getInferredType(model: InferredType) {
  return `infer ${escapeChars(model.name)}`
}

function getUnknownType(model: UnknownType) {
  return escapeChars(model.name)
}

function getConditionalType(model: ConditionalType) {
  const md: string[] = []
  if (model.checkType) {
    md.push(Handlebars.helpers.type.call(model.checkType))
  }
  md.push('extends')
  if (model.extendsType) {
    md.push(Handlebars.helpers.type.call(model.extendsType))
  }
  md.push('?')
  if (model.trueType) {
    md.push(Handlebars.helpers.type.call(model.trueType))
  }
  md.push(':')
  if (model.falseType) {
    md.push(Handlebars.helpers.type.call(model.falseType))
  }
  return md.join(' ')
}

function getIndexAccessType(model: IndexedAccessType) {
  const md: string[] = []
  if (model.objectType) {
    md.push(Handlebars.helpers.type.call(model.objectType))
  }
  if (model.indexType) {
    md.push(`[${Handlebars.helpers.type.call(model.indexType)}]`)
  }
  return md.join('')
}

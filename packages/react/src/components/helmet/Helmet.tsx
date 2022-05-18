import React from 'react'
import isEqual from 'react-fast-compare'
import withSideEffect from 'react-side-effect'
import { TAG_NAMES, VALID_TAG_NAMES } from './HelmetConstants.js'
import {
  convertReactPropstoHtmlAttributes,
  handleClientStateChange,
  mapStateOnServer,
  reducePropsToState,
} from './HelmetUtils.js'
import { HelmetData, HelmetProps } from './types.js'

const isReactNode = (reactNode: React.ReactNode): reactNode is React.ReactElement => {
  return !!(reactNode && (reactNode as any).props)
}

type ArrayTypeChildren = Record<string, any>
interface FlattenArrayTypeChildren {
  child: React.ReactElement
  arrayTypeChildren?: ArrayTypeChildren
  newChildProps: any
  newProps?: any
  nestedChildren: any
}

const Helmet = (Component: any) =>
  class HelmetWrapper extends React.Component<HelmetProps> {
    static renderStatic: () => HelmetData

    static defaultProps = {
      defer: true,
      encodeSpecialCharacters: true,
    }

    // Component.peek comes from react-side-effect:
    // For testing, you may use a static peek() method available on the returned component.
    // It lets you get the current state without resetting the mounted instance stack.
    // Don’t use it for anything other than testing.
    static peek = Component.peek

    static rewind = (): HelmetData => {
      let mappedState = Component.rewind()
      if (!mappedState) {
        // provide fallback if mappedState is undefined
        mappedState = mapStateOnServer({
          baseTag: [],
          bodyAttributes: {},
          encodeSpecialCharacters: true,
          htmlAttributes: {},
          linkTags: [],
          metaTags: [],
          noscriptTags: [],
          scriptTags: [],
          styleTags: [],
          title: '',
          titleAttributes: {},
        })
      }

      return mappedState
    }

    static set canUseDOM(canUseDOM: boolean) {
      Component.canUseDOM = canUseDOM
    }

    shouldComponentUpdate(nextProps: HelmetProps) {
      return !isEqual(this.props, nextProps)
    }

    mapNestedChildrenToProps(child: React.ReactElement, nestedChildren: any) {
      if (!nestedChildren) {
        return null
      }

      switch (child.type) {
        case TAG_NAMES.SCRIPT:
        case TAG_NAMES.NOSCRIPT:
          return {
            innerHTML: nestedChildren,
          }

        case TAG_NAMES.STYLE:
          return {
            cssText: nestedChildren,
          }
      }

      throw new Error(
        `<${child.type} /> elements are self-closing and can not contain children. Refer to our API for more information.`
      )
    }

    flattenArrayTypeChildren({ child, arrayTypeChildren, newChildProps, nestedChildren }: FlattenArrayTypeChildren) {
      return {
        ...arrayTypeChildren,
        [child.type as string]: [
          ...(arrayTypeChildren![child.type as string] || []),
          {
            ...newChildProps,
            ...this.mapNestedChildrenToProps(child, nestedChildren),
          },
        ],
      }
    }

    mapObjectTypeChildren({ child, newProps, newChildProps, nestedChildren }: FlattenArrayTypeChildren) {
      switch (child.type) {
        case TAG_NAMES.TITLE:
          return {
            ...newProps,
            [child.type]: nestedChildren,
            titleAttributes: { ...newChildProps },
          }

        case TAG_NAMES.BODY:
          return {
            ...newProps,
            bodyAttributes: { ...newChildProps },
          }

        case TAG_NAMES.HTML:
          return {
            ...newProps,
            htmlAttributes: { ...newChildProps },
          }
      }

      return {
        ...newProps,
        [child.type as string]: { ...newChildProps },
      }
    }

    mapArrayTypeChildrenToProps(arrayTypeChildren: ArrayTypeChildren, newProps: any) {
      let newFlattenedProps = { ...newProps }

      Object.keys(arrayTypeChildren).forEach((arrayChildName) => {
        newFlattenedProps = {
          ...newFlattenedProps,
          [arrayChildName]: arrayTypeChildren[arrayChildName],
        }
      })

      return newFlattenedProps
    }

    warnOnInvalidChildren(_child: any, _nestedChildren: any) {
      // @ts-expect-error Process check
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        if (!VALID_TAG_NAMES.some((name) => _child.type === name)) {
          if (typeof _child.type === 'function') {
            return console.warn(
              `You may be attempting to nest <Helmet> components within each other, which is not allowed. Refer to our API for more information.`
            )
          }

          return console.warn(
            `Only elements types ${VALID_TAG_NAMES.join(', ')} are allowed. Helmet does not support rendering <${
              _child.type
            }> elements. Refer to our API for more information.`
          )
        }

        if (
          _nestedChildren &&
          typeof _nestedChildren !== 'string' &&
          (!Array.isArray(_nestedChildren) || _nestedChildren.some((nestedChild) => typeof nestedChild !== 'string'))
        ) {
          throw new Error(
            `Helmet expects a string as a child of <${_child.type}>. Did you forget to wrap your children in braces? ( <${_child.type}>{\`\`}</${_child.type}> ) Refer to our API for more information.`
          )
        }
      }

      return true
    }

    mapChildrenToProps(children: React.ReactNode, newProps: HelmetProps) {
      let arrayTypeChildren = {}

      React.Children.forEach(children, (child) => {
        if (!isReactNode(child)) {
          return
        }

        const { children: nestedChildren, ...childProps } = child.props
        const newChildProps = convertReactPropstoHtmlAttributes(childProps)

        this.warnOnInvalidChildren(child, nestedChildren)

        switch (child.type) {
          case TAG_NAMES.LINK:
          case TAG_NAMES.META:
          case TAG_NAMES.NOSCRIPT:
          case TAG_NAMES.SCRIPT:
          case TAG_NAMES.STYLE:
            arrayTypeChildren = this.flattenArrayTypeChildren({
              child,
              arrayTypeChildren,
              newChildProps,
              nestedChildren,
            })
            break

          default:
            newProps = this.mapObjectTypeChildren({
              child,
              newProps,
              newChildProps,
              nestedChildren,
            })
            break
        }
      })

      newProps = this.mapArrayTypeChildrenToProps(arrayTypeChildren, newProps)
      return newProps
    }

    render() {
      const { children, ...props } = this.props
      let newProps = { ...props }

      if (children) {
        newProps = this.mapChildrenToProps(children, newProps)
      }

      return <Component {...newProps} />
    }
  }

const NullComponent = () => null

const HelmetSideEffects = withSideEffect(reducePropsToState, handleClientStateChange, mapStateOnServer)(NullComponent)

const HelmetExport = Helmet(HelmetSideEffects)
HelmetExport.renderStatic = HelmetExport.rewind

export { HelmetExport as Helmet }

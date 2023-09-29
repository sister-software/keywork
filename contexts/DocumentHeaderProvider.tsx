import React, { ReactNode, createContext, useContext } from 'react'

/**
 * @internal
 */
export const DocumentHeaderContext = createContext<React.ReactNode[]>([])
DocumentHeaderContext.displayName = 'DocumentHeaderContext'

function useDocumentHeader() {
  const context = useContext(DocumentHeaderContext)
  if (context === undefined) {
    throw new Error('useDocumentHeader must be used within a DocumentHeaderProvider')
  }
  return context
}

export interface HeadProps {
  children: React.ReactNode
}

/**
 * A Keywork component that can be used to inject `<head>` content into the HTML document.
 */
export class DocumentHeadPortal extends React.Component<HeadProps> {
  static state: ReactNode[] = []

  static reset() {
    DocumentHeadPortal.state = []
  }

  render() {
    DocumentHeadPortal.state.push(this.props.children)

    return null
  }
}

/**
 * @internal
 */
export interface DocumentHeaderProviderProps {
  children: React.ReactNode
}

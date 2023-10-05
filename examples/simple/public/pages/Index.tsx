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

import { useEffect, useState } from 'react'

export interface AppProps {
  renderTimestamp: string
}

export const IndexPage: React.FC<AppProps> = ({ renderTimestamp }) => {
  const [timestamp, setTimestamp] = useState<Date>(() => new Date(renderTimestamp))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <h1>Hello from Keywork!</h1>
      <h2>{timestamp.toISOString()}</h2>
      <p>And this is a JSX response!</p>
      <a href="/todo/1">Todo 1</a>
    </div>
  )
}

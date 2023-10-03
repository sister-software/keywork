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
    </div>
  )
}

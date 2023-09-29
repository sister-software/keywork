import { RequestRouter } from 'keywork'

const router = new RequestRouter({
  logLevel: 'Debug',
  document: {
    title: 'Keywork example app',
    themeColor: '#65b9e2',
    importMap: {
      imports: {
        keywork: './dist/index.js',
        'keywork/utils': './dist/utils/index.js',
      },
    },
  },
})

router.get('/', ({ document }) => {
  document.author = 'Teffen Ellis'

  return <App renderTimestamp={new Date()} />
})

export interface AppProps {
  renderTimestamp: Date
}

const App: React.FC<AppProps> = ({ renderTimestamp }) => {
  return (
    <div>
      <h1>Hello from Keywork!</h1>
      <h2>{renderTimestamp.toISOString()}</h2>
      <p>And this is a JSX response!</p>
    </div>
  )
}

export default router

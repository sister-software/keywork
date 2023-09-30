import { RequestRouter } from 'keywork'

const router = new RequestRouter({
  logLevel: 'Debug',
  document: {
    title: 'Keywork example app',
    themeColor: '#65b9e2',
    importMap: {
      imports: {
        keywork: './dist/index.js',
        'keywork/cli': './dist/cli/index.js',
        'keywork/node': './dist/node/index.js',
        'keywork/components': './dist/components/index.js',
        'keywork/contexts': './dist/contexts/index.js',
        'keywork/errors': './dist/errors/index.js',
        'keywork/docgen': './dist/docgen/index.js',
        'keywork/docgen/utils': './dist/docgen/utils/index.js',
        'keywork/docgen/helpers': './dist/docgen/helpers/index.js',
        'keywork/docgen/theme': './dist/docgen/theme/index.js',
        'keywork/events': './dist/events/index.js',
        'keywork/files': './dist/files/index.js',
        'keywork/files/extensions': './dist/files/extensions/index.js',
        'keywork/http': './dist/http/index.js',
        'keywork/http/headers': './dist/http/headers/index.js',
        'keywork/http/responses': './dist/http/responses/index.js',
        'keywork/lifecycle': './dist/lifecycle/index.js',
        'keywork/middleware': './dist/middleware/index.js',
        'keywork/router': './dist/router/index.js',
        'keywork/ssr': './dist/ssr/index.js',
        'keywork/cloudflare': './dist/cloudflare/index.js',
        'keywork/testing': './dist/testing/index.js',
        'keywork/utils': './dist/utils/index.js',
        negotiator: 'https://esm.sh/negotiator',
        react: 'https://esm.sh/react',
        'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime',
        'react-dom/client': 'https://esm.sh/react-dom/client',
        'react-dom/server.browser': 'https://esm.sh/react-dom/server.browser',
        cookie: 'https://esm.sh/cookie',
        ulidx: 'https://esm.sh/ulidx',
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

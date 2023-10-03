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
        'keywork/client': './dist/client/index.js',
        'keywork/logging': './dist/logging/index.js',
        'keywork/node': './dist/node/index.js',
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
        'keywork/uri': './dist/uri/index.js',
        cookie: 'https://esm.sh/cookie@^0.5.0',
        negotiator: 'https://esm.sh/negotiator@^0.6.3',
        ulidx: 'https://esm.sh/ulidx@^2.1.0',
        react: 'https://esm.sh/react@>=18.2',
        'react/jsx-runtime': 'https://esm.sh/react@>=18.2/jsx-runtime',
        'react-dom': 'https://esm.sh/react-dom@>=18.2',
        'react-dom/server': 'https://esm.sh/react-dom@>=18.2/server',
        'react-dom/server.browser': 'https://esm.sh/react-dom@>=18.2/server.browser',
        'react-dom/client': 'https://esm.sh/react-dom@>=18.2/client',
        undici: 'https://esm.sh/undici@>=5.25.2',
        'urlpattern-polyfill': 'https://esm.sh/urlpattern-polyfill@^5.0.5',
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

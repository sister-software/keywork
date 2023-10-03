import { KeyworkApp, KeyworkPatternToPageComponent, pluckKeyworkHydrationElement, waitUntilDOMReady } from 'keywork'
import { hydrateRoot } from 'react-dom/client'
import { IndexPage } from './pages/Index.js'

waitUntilDOMReady().then(() => {
  console.log('DOM is ready!')

  hydrateRoot(
    pluckKeyworkHydrationElement(),
    <KeyworkApp>
      <KeyworkPatternToPageComponent routes={[['/', IndexPage]]} />
    </KeyworkApp>
  )
})

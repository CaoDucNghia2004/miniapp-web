import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import useRouteElements from './useRouteElements'

function App() {
  const routerElements = useRouteElements()
  return (
    <div>
      <ScrollToTop />
      {routerElements}
    </div>
  )
}

export default App

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as ReactDOM from 'react-dom'

import './locales'
import './icons'

import App from './app'
import './styles/base.less'

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

render()

if (module.hot) {
  module.hot.accept('./App', render)
}

import urbitAPI from './urbitAPI'
import * as airlock from './airlock'
import * as keep from './keep'

export default {
  ...urbitAPI,
  ...airlock,
  ...keep
}

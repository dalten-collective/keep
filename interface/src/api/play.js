import urbitAPI from './urbitAPI'

export default {
  guess(gues) {
    urbitAPI.poke({
      app: 'wrdu',
      mark: 'wrdu-game',
      json: {
        'guess': {
          'test': gues
        }
      }
    });
  }
}

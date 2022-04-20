import urbitAPI from './urbitAPI'

export default {
  startGame() {
    urbitAPI.poke({
      app: 'wrdu',
      mark: 'wrdu-game',
      json: {
        'start': null
      }
    });
  },

  shrug() {
    urbitAPI.poke({
      app: 'wrdu',
      mark: 'wrdu-game',
      json: {
        'shrug': null 
      }
    });
  },

  shrug() {
    urbitAPI.poke({
      app: 'wrdu',
      mark: 'wrdu-game',
      json: {
        'shrug': null 
      }
    });
  }
}

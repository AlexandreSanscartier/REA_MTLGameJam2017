export default class {


  constructor({ game }) {
    this.game = game;
    this.game.scoreText = this.game.add.text(10, 10, this.getScoreString());
    this.game.scoreText.boundsAlignH = 'left';
    this.game.scoreText.font = 'Press Start 2P';
    this.game.scoreText.fontSize = 25;
    this.game.scoreText.fill = '#FF0000';
    this.game.scoreText.fixedToCamera = true;

    // Integer values for tracking various score mechanics
    this.enemiesRemaining = 0;
  }

  update() {
    this.game.scoreText.text = this.getScoreString();
  }

  setEnemyCount(count){
    this.enemiesRemaining = count;
  }

  getScoreString() {
    return `Enemies Remaining:${this.enemiesRemaining}`;
  }
}

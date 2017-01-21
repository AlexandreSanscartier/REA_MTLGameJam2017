import Phaser from 'phaser';
import { centerGameObjects } from '../utils';

export default class extends Phaser.State {
  init() {}

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png');
    this.load.image('waveman_bullet_blue', 'assets/images/waveman_bullet_2.png');
    this.load.image('background', 'assets/images/Starbasesnow.png');

    this.game.load.audio('menu_song', 'assets/sounds/menu_screen.mp3', 1, true);
  }

  create() {
    this.state.start('Game');
  }

}

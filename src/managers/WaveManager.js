import Phaser from 'phaser';
import Blob from '../sprites/Blob';
import Waveman from '../sprites/Waveman';
import DeathCircleManager from '../managers/DeathCircleManager';

export default class {
    constructor({ game, hudManager }) {
        this.game = game;
        this.hudManager = hudManager;

        this.hasWaveInProgress = false;
        this.currentWave = 0;
        this.maxWave = 3;

        // Groups
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
    }

    update() {
        if(!this.hasWaveInProgress) {
            return;
        }

        // Check for player fire on enemy
        this.game.physics.arcade.collide(this.player.weapon.bullets, this.enemies, (bullet, enemy) => { 
            this.deathCircleManager.pushAway(5);
            enemy.hitByBullet(bullet);
            if(!enemy.alive) {
                this.hudManager.getManager('score').increaseEnemyKillCount();
            }
        }, null, this);

        // Check for enemy fire on player
        this.enemies.forEach((enemy) => {
            this.game.physics.arcade.collide(this.player, enemy.weapon.bullets, (player, bullet) => { 
                this.deathCircleManager.pullIn(10);
                player.hitByBullet(bullet);
                }, null, this);
        });

        // Check if player hits the death circle
        this.game.physics.arcade.collide(this.player, this.deathCircleManager.getDeathCircleGroup(), (player, circle) => {
            this.game.soundTrackManager.stopSoundTracks();
            this.game.state.start('Splash');
            this.player.dies();
        }, null, this);

        // Check for death circle sound
        if (this.deathCircleManager.deathCircleIsRed()) {  
            this.game.soundTrackManager.playAlarmingSoundtrack();
        }

        // Check for Wave End
        this.checkForWaveEnd();
    }

    startNextWave(){
        // Next Wave Counter
        this.currentWave++;

        // Check Game won
        this.checkForGameWon();

        // Generate player
        this.createOrResetPlayer();

        // Generate Death Circle
        this.createOrResetDeathCircle();

        // Generate enemies
        this.createEnemies();

        // display 3 2 1 GO countdown
        this.displayWaveIntro();

        // Start Wave
        this.hasWaveInProgress = true;
    }

    checkForWaveEnd(){
        if(this.enemies.countLiving() <= 0){
            // When enemies are all killed
            this.startNextWave();
        } else if (!this.player.alive) {
            // When player is killed
            console.log("Lose!");
        }
    }

    checkForGameWon(){
        if(this.currentWave > this.maxWave){
            // Temp hack!
            console.log("GameWon!");
            this.currentWave = 1;
        }
    }

    createOrResetPlayer() {
        if(this.player) {
            this.player.reset(this.game.world.centerX, this.game.world.centerY);
        } else {
            this.player = new Waveman({ game: this.game });
            this.game.add.existing(this.player);
            this.game.camera.follow(this.player);
        }
    }

    createOrResetDeathCircle(){
        if(this.deathCircleManager) {
            // reset circle
        } else {
            this.deathCircleManager = new DeathCircleManager({
                game: this.game,
                startingRadius: 1000,
                dots: 200,
            });
            
            this.deathCircleManager.initialize();
        }
    }

    createEnemies() {
        // This will destroy all enemies.
        this.enemies.removeAll(true);

        // TODO: add enemies depending on difficulty.
        // TODO: Add more types of enemies.
        const blob = new Blob({
            game: this.game,
            asset: 'ufo',
            player: this.player,
        });

        this.enemies.add(blob);
    }

    displayWaveIntro(){
        let txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Wave " + this.currentWave);
        txt.font = 'Press Start 2P';
        txt.fontSize = 40;
        txt.fill = '#FF0000';
        txt.anchor.set(0.5);
        this.game.time.events.add(1000, () => {
            this.game.add.tween(txt).to({y: 0}, 750, Phaser.Easing.Linear.None, true);
            this.game.add.tween(txt).to({alpha: 0}, 750, Phaser.Easing.Linear.None, true);
        }, this);
    }
}
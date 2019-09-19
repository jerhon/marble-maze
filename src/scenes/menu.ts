import { GameStateMachine } from "./gameStateMachine";

export const MENU_SCENE = 'Menu';

const menuConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: MENU_SCENE
}

export class MenuScene extends Phaser.Scene {

    private stateMachine: GameStateMachine;
    currentOption = 0;

    constructor() {
      super(menuConfig);  

      this.stateMachine = new GameStateMachine(this);
    }

    options = [
        'New Game',
        //'Timed Game',
        'About'
    ]
    menuOptions: Phaser.GameObjects.Text[] = [];
  
    public create() {
        let selected = 0;
        let idx = 0;
        for (let opt of this.options) {
            console.log(opt);
            let optText = this.add.text(10, 10 + (idx * 70), opt, {
                fontSize: '40px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center'
            });
            optText.setInteractive();
            var callback = ((v1) => (pointer, gameObject) => this.optionPicked(v1))(opt)
            optText.on('pointerup', callback);
            this.menuOptions.push(optText);
            idx++;
        }

        this.input.on('pointerdown', (pointer : Phaser.Input.Pointer) => {
            console.log("it's down.");
            var option = this.getMenuOptionFromPoint(pointer.worldX, pointer.worldY);
            if (option) {
                console.log(this.options[option]);
            }
        });
        
    }

    getMenuOptionFromPoint(x:number, y:number) : number {
        let currentOpt = Math.floor((y - 10) / 70);
        if (currentOpt < 0 || currentOpt >= this.menuOptions.length) {
            currentOpt = 0;
        }
        return currentOpt;
    }

    public optionPicked(option: string) {
        console.log('option', option);
        switch (option) {
            case "New Game":
                this.stateMachine.startLoadingLevel({ })
                break;
            case "Timed Game":
                this.stateMachine.startLoadingLevel({ })
                break;
        }
    }

    public update(time: number, delta: number) {

        this.currentOption = this.getMenuOptionFromPoint(this.input.mousePointer.worldX, this.input.mousePointer.worldY);
        
        for (let i = 0; i < this.menuOptions.length; i++) {
            if (i != this.currentOption) {
                this.menuOptions[i].alpha = 1;
            }
        }
        this.menuOptions[this.currentOption].alpha = 1 - (time % 750) / 750;
        
    }
  
}
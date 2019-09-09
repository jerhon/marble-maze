
const menuConfig : Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Menu'
}

export class MenuScene extends Phaser.Scene {

    currentOption = 0;

    constructor() {
      super(menuConfig);  
    }

    options = [
        'Liesure Game',
        'Timed Game',
        'About'
    ]
    menuOptions: Phaser.GameObjects.Text[] = [];
  
    public create() {
        let selected = 0;
        let idx = 0;
        for (let opt of this.options) {
            console.log(opt);
            let optText = this.add.text(10, 10 + (idx * 50), opt, {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',
            });
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
        let currentOpt = Math.floor((y - 10) / 50);
        if (currentOpt < 0 || currentOpt >= this.menuOptions.length) {
            currentOpt = 0;
        }
        return currentOpt;
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
import { _decorator, Component, Node, tween, Vec3, SpriteFrame, Sprite, Prefab, instantiate, Label, find, utils, Button, director } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('gameManager')
export class gameManager extends Component {
    // 绳子节点
    @property({type:Node})
    public rope_node:Node|null = null

    //牛节点
    @property({type:Node})
    public cow:Node|null = null

    //捕捉后绳子图片
    @property({type:SpriteFrame})
    public capturedRope:SpriteFrame|[] = []

    // 牛的预制体（在捕捉到牛后，需要被捕捉到的牛节点进行移除，然后添加新的牛节点）
    @property({type:Prefab})
    public cowPerfab:Prefab|null = null

    //添加在属性里，方便修改
    @property({type:Number})
    public time:any = 0

    private score = 0
    
    
    start() {
        //隐藏绳子
        this.rope_node.active = false
        // 隐藏结束面板
        let result = this.node.getChildByPath('/result')
        result.active = false
        // 倒计时节点
        let timeDownLabel = utils.find('Canvas/time_down_show').getComponent(Label)
        timeDownLabel.string = this.time + 'S'
        // 倒计时60s，先定义一个回调
        let callback = () => { 
            this.time--
            timeDownLabel.string = this.time + 'S'
            // 如果时间等于0
            if(this.time === 0) {
                result.active = true
                // 暂停游戏
                director.pause()
                let score = result.getChildByName('score').getComponent(Label)
                let name = result.getChildByName('name').getComponent(Label)
                score.string = '最终得分 :' + this.score
                switch (true) {
                    case this.score <= 3:
                        name.string = '套牛弟弟'
                        break;
                    case this.score < 3:
                        name.string = '套牛哥哥'
                        break;
                    case this.score >= 6:
                        name.string = '套牛大爷'
                        break;
                    default:
                        break;
                }
                // 结束计时
                // this.unschedule(callback)
            }
         } 
         this.schedule(callback , 1)
    }

    update(deltaTime: number) {
        
    }
    //点击按钮的回调
    captureCow() {
        // 点击按钮，绳子出现
        this.rope_node.active = true

        // 定义绳子的起始位置
        this.rope_node.position = new Vec3(10 , -722 , 0)

        // 定义绳子去抓捕动画
        let out = 
        tween(this.rope_node).to(0.5 , {position:new Vec3(22 , -120 , 0)})
        .call(() => { 
            //牛的x位置
            let cowX = this.cow.getPosition().x 
            // 抓捕成功，抓捕成功后绳子的图片得换一个
            if(cowX > -80 && cowX < 120){
                console.info("success")
                // 得到抓捕到的牛皮肤的索引，然后加一（因为抓捕的图片中，有没抓到的图片索引为0）
                let skinIndex = this.cow.getComponent('cows_move').cowSkinIndex + 1
                // 改变绳子的图片
                this.rope_node.getComponent(Sprite).spriteFrame = this.capturedRope[skinIndex]

                // 移除被捕捉的牛节点(this.cow就是当前捕捉的这个牛)
                this.node.getChildByName('bg_img').removeChild(this.cow)
                // 移除之后，还要添加新的牛(instantiate(this.cowPerfab)实例化预制体)
                this.cow = instantiate(this.cowPerfab)
                this.node.getChildByName('bg_img').addChild(this.cow)

                //抓捕成功，分数加一
                this.score = this.score + 1
                console.info(this.score)
                this.node.getChildByName('ScoreShow').getComponent(Label).string = `${this.score}`
                console.info(this.node.getChildByName('ScoreShow').getComponent(Label).string)
            }else {
                console.info('false')
            }
         }) 
        // 定义绳子抓完的动画 
        let outIn = 
        tween(this.rope_node).to(0.5 , {position:new Vec3(10 , -722 , 0)})
        .call(() => {
            // 抓捕之后，绳子还原 
            this.rope_node.getComponent(Sprite).spriteFrame = this.capturedRope[0]
         })
        tween(this.rope_node).sequence(out , outIn).start()

        
    }

    // 关闭按钮
    close() {
        // 有暂停就有恢复
        director.resume()
        // 重新加载主场景
        director.loadScene("scene")
    }

}




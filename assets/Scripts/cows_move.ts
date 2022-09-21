import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

// 定义牛的皮肤类
@ccclass('cow_skin')
class cow_skin {
    @property({type:[SpriteFrame]})
    public cows = []
}


@ccclass('cows_move')
export class cows_move extends Component {
    // 定义类型为皮肤的属性
    @property({type:[cow_skin]})
    public cow_set = []

    // 定义一个时间变量
    public intervalTime = 0

    //定义牛皮肤的索引
    public cowSkinIndex:any = Math.floor(Math.random()*3)

    start() {
    }

    update(deltaTime: number) {
        this.intervalTime += deltaTime
        // 定义牛奔跑状态的索引 ， 每0.2秒换一次奔跑状态
        let index = Math.floor(this.intervalTime / 0.2)
        // 得到牛的奔跑状态的索引
        index = index % 3

        // 获取牛的一种类型
        let cowSet = this.cow_set[this.cowSkinIndex]
        // 获取牛的节点
        let sprite = this.node.getComponent(Sprite)
        // 设置牛的三种奔跑状态
        sprite.spriteFrame = cowSet.cows[index]
    }

    changeCowSkin() {
        //每次循环结束，随机牛的皮肤
        this.cowSkinIndex = Math.floor(Math.random()*3)
    }
}



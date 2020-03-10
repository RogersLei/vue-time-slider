**【效果图】**

![demo](https://github.com/RogersLei/vue-time-slider/blob/master/src/assets/timeline-demo.png)

**【如何使用】**

npm install vue-time-slider
```
// 在 main.js 中
import TimeSlider from "vue-time-slider"
import "vue-time-slider/dist/timeslider.css"

Vue.use(TimeSlider)

```
### 时间轴组件

在产品经理需求下，并没有找到满足需求的时间轴控制组件。遂快速写了个组件，即时间范围时间轴。

在写时间范围时间轴时，仅仅预留了部分可配置信息，导致接下来项目中，时间轴选用了 时间点来控制时，需要进行一波更改。所以打算重新整理下现有的时间轴，然后提供多一点的配置，可选时间轴的类型。


#### 时间范围 、 时间点 、 时间范围点

传递参数的定义：
1. range: Array required 时间轴整体范围
2. show-stops: Boolean 是否将时间轴均分并显示stop
3. step：Number 秒为单位 / Array 均分的间隔 [ 1, "d" ], [ 1, "h" ] 仅支持m，h，d  默认根据range确认 （小于1小时则按照分钟，小于1天则按照2小时, 大于1天则按照天）
4. disabled: Boolean 是否禁止操作
5. show-tooltip: Boolean 是否显示选择点/选择范围点上的tooltip
6. format-tooltip: "YYYY/MM/DD HH:mm:ss"
7. marks: Array  { value: ts, label: "" }
8. show-stops-label: Boolean 是否显示 stops上的label
9. stops-format-label: "YYYY/MM/DD HH:mm:ss" 格式化 stops上的label
10. selectRange: Array 选中的时间范围
11. selectTime: Number 选中的时间
12. show-select-time-icon: Boolean 是否显示选中时间的icon
13. changeSelectRange事件  选中范围更改
14. changeSelectTime事件 选中时间更改
15. is-local: 是否使用本地时间  【可以考虑是否是直接和disabeld 采用同一种方式】
16. tooltip-effect: 使用element toolitp的主题
17. max-select-range: 可选择的最大时间范围

> 补充:

> 默认 当点击时是 显示 tooltip

> 当使用 show-select-time-icon 则取消原有的模式

> 当范围选择 和 选择点 同时存在时， 若最小值 > 当前值 则当前值 = 最小值，若最大值 < 当前值 则 当前值 = 最大值

> 当在时间轴上（非范围选择轴的地方）/ 每个间隔点上  点击时：满足就近原则



##### [ 就近原则 ]：
1. 只有点选择时， 直接移动currentValue，
2. 只有范围选择时， 判断当前选择点的时间 与  最大最小值的 差值，将差值小的点 更改为当前选择点
3. 当 点选则 和 范围选择 同时存在时，如果 当前选择点 不在 范围原则内 则依照2规则 更改， 若在范围选择内 则按1 更改

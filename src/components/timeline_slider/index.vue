<template>
    <div :class="['timeline', disabled ? 'disabled' : '']">
    <div class="timeline__runway" @click="onSelect">
        <div class="timeline__barBox" :style="{ left: minValuePos + '%', width: (maxValuePos - minValuePos) + '%' }">
            <div class="timeline__bar"></div>
        </div>
        <div class="timeline__range_wrapper leftPoint" :style="{left: minValuePos + '%' }" v-if="minValue">
            <el-tooltip :open-delay="200" :effect="tooltipEffect" placement="top" popper-class="timeline_custom__tooltip" :content="minValueTooltip" v-if="showTooltip && !dragDom">
                <div class="timeline_button"></div>
            </el-tooltip>
            <div class="timeline_button" v-else></div>
            <div class="timeline_custom__label timeline_custom__label--min" :style="{visibility: minValueLabelVisiable ? 'visible': 'hidden', transform: 'translateX(' + minValueTooltipTransform + '%)'}">{{ minValueTooltip }}</div>
        </div>
        <div class="timeline__range_wrapper rightPoint" :style="{left: maxValuePos + '%' }" v-if="maxValue">
            <el-tooltip :open-delay="200" :effect="tooltipEffect" placement="top" popper-class="timeline_custom__tooltip" :content="maxValueTooltip" v-if="showTooltip && !dragDom">
                <div class="timeline_button"></div>
            </el-tooltip>
            <div class="timeline_button" v-else></div>
            <div class="timeline_custom__label timeline_custom__label--max" :style="{visibility: maxValueLabelVisiable ? 'visible': 'hidden', transform: 'translateX(' + maxValueTooltipTransform + '%)'}">{{ maxValueTooltip }}</div>
        </div>
        <div v-if="stops && stops.length > 0 && showStops">
            <div class="timeline__stop" v-for="(item,index) in stops" :key="index" :style="{left: item.percent +'%' }" @click.stop="onSelect($event, item.value)">
            </div>
        </div>
        <div class="timeline__marks" v-if="stops && stops.length > 0 && showStops && showStopsLabel && ( !maxValueLabelVisiable && !minValueLabelVisiable && !currentValueVisiable )">
            <div class="timeline__marks-label" v-for="(item,index) in stops" :key="index" :style="{left: item.percent +'%' }" @click.stop="onSelect($event, item.value)">{{ item.label }}</div>
        </div>
        <div class="timeline__pointer curPoint" :style="{left: currentValuePos + '%' }" v-if="currentValue">
            <div v-if="showSelectTimeIcon">
                <el-tooltip :open-delay="200" :effect="tooltipEffect" placement="top" popper-class="timeline_custom__tooltip" :content="currentValueTooltip" v-if="showTooltip && !dragDom">
                    <div class="timeline__pointer_icon"></div>
                </el-tooltip>
                <div class="timeline__pointer_icon" v-else></div>
                <div class="timeline_custom__label timeline_custom__label--cur" :style="{visibility: currentValueVisiable ? 'visible': 'hidden', transform: 'translateX(' + currentValueTooltipTransform + '%)'}"> {{ currentValueTooltip }}</div>
            </div>
            <div v-else>
                <el-tooltip :open-delay="200" :effect="tooltipEffect" placement="top" popper-class="timeline_custom__tooltip" :content="currentValueTooltip" v-if="showTooltip && !dragDom">
                    <div class="timeline_button"></div>
                </el-tooltip>
                <div class="timeline_button" v-else></div>
                <div class="timeline_custom__label timeline_custom__label--cur" :style="{visibility: currentValueVisiable ? 'visible': 'hidden', transform: 'translateX(' + currentValueTooltipTransform + '%)'}">{{ currentValueTooltip }}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import moment from "moment";

const format = "YYYY/MM/DD HH:mm:ss";
const minute = 1 * 60;
const minutes5 = 5 * 60;
const hour = 1 * 60 * 60;
const hours2 = 2 * 60 * 60;
const day = 1 * 24 * 60 * 60;

export default {
  name: "TimelineSlider",
  props: {
    range: {
      type: Array,
      default: () => [],
      required: true,
      validator( value ) {
        if ( !value[ 0 ] || !value[ 1 ] || typeof value[ 0 ] !== "number" || typeof value[ 1 ] !== "number" || value[ 1 ] <= value[ 0 ] ) {
          return false;
        }
        return true;
      },
    },
    marks: {
      type: Array,
      default: () => [],
      validator( value ) {
        let flag = true;
        for ( let i = 0;i < value.length;i++ ) {
          if ( value[ i ].label === undefined || ( value[ i ].value === undefined || typeof value[ i ].value !== "number" ) ) {
            flag = false;
          }
        }
        return flag;
      },
    },
    showStops: {
      type: Boolean,
      default: false,
    },
    step: {
      type: [ Array, Number ],
      validator( value ) {
        if ( Object.prototype.toString.call( value ) === "[object Array]" ) {
          if ( typeof value[ 0 ] !== "number" || value[ 0 ] <= 0 || [ "m", "h", "d" ].indexOf( value[ 1 ] ) === -1 ) {
            return false;
          }
        }
        return true;
      }
    },
    showStopsLabel: {
      type: Boolean,
      default: true,
    },
    stopsFormatLabel: {
      type: String,
      default: format,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showTooltip: {
      type: Boolean,
      default: true,
    },
    formatTooltip: {
      type: String,
      default: format,
    },
    tooltipEffect: {
      type: String,
      default: "dark",
      validator( value ) {
        if ( value && [ "dark", "light" ].indexOf( value ) !== -1 ) {
          return true;
        }
        return false;
      }
    },
    selectRange: {
      type: Array,
      default: () => [],
      validator( value ) {
        if ( value.length >= 2 && ( !value[ 0 ] || !value[ 1 ] || typeof value[ 0 ] !== "number" || typeof value[ 1 ] !== "number" || value[ 1 ] <= value[ 0 ] ) ) {
          return false;
        }
        return true;
      },
    },
    maxSelectRange: {
      type: Number,
    },
    selectTime: {
      type: Number,
    },
    showSelectTimeIcon: {
      type: Boolean,
      default: true,
    },
    isLocal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let minValue, maxValue;
    if ( this.selectRange.length === 2 ) {
      minValue =  this.selectRange[ 0 ];
      maxValue =  this.selectRange[ 1 ];
      const min = Math.min( this.range[ 0 ], this.range[ 1 ] );
      if ( minValue < min ) {
        minValue = min;
      }
      const max = Math.max( this.range[ 0 ], this.range[ 1 ] );
      if ( maxValue > max ) {
        maxValue = max;
      }
    }
    const currentValue = this.selectTime;
    return {
      minValue: minValue,
      maxValue: maxValue,
      currentValue: currentValue,

      minValueLabelVisiable: false,
      maxValueLabelVisiable: false,
      currentValueVisiable: false,

      isDrag: false,
      dragDom: null,

      container: null,  // body

      runway: null,
      barBox: null,
      barMousedownclientX: 0,


      leftPoint:null,
      rightPoint: null,
      curPoint: null,

      minValueTooltipTransform: -50,
      maxValueTooltipTransform: -50,
      currentValueTooltipTransform: -50,
    };
  },
  computed: {
    isUTC() {
      return !this.isLocal;
    },
    min() {
      return Math.min( this.range[ 0 ], this.range[ 1 ] );
    },
    max() {
      return Math.max( this.range[ 0 ], this.range[ 1 ] );
    },
    timeDiff() {
      return this.max - this.min;
    },
    customStep() {
      let step = 0;
      if ( !this.step ) {
        // 如果没有不存在step  则按照默认step 小于1小时则按照分钟，小于1天则按照2小时, 大于1天则按照天
        if ( this.max - this.min < hour ) {
          step = minutes5;
        } else if ( this.max - this.min < day ) {
          step = hours2;
        } else {
          step = day;
        }
      } else {
        // 如果传入了 step  判断  step 为 数字 或 数组
        if ( typeof this.step === "number" ) {
          step = this.step;
        } else if ( Object.prototype.toString.call( this.step ) === "[object Array]" ) {
          if ( this.step[ 1 ] === "m" ) {
            step = this.step[ 0 ] * minute;
          }else if ( this.step[ 1 ] === "h" ) {
            step = this.step[ 0 ] * hour;
          } else if ( this.step[ 1 ] === "d" ) {
            step = this.step[ 0 ] * day;
          }
        }
      }
      return step;
    },
    stops() {
      let stops = [];
      if ( this.marks.length > 0 ) {
        stops = [].concat( this.marks );
        stops.map( item => {
          item.percent = ( item.value - this.min ) / this.timeDiff * 100;
          return item;
        } );
      } else {
        const length = this.timeDiff / this.customStep + 1;
        for ( let i = 0;i < length;i++ ) {
          const value = this.min + this.customStep * i;
          const percent = ( value - this.min ) / this.timeDiff * 100;
          stops.push( {
            value,
            percent,
            label: this.isUTC ? moment( value * 1000 ).utc().format( this.stopsFormatLabel ) : moment( value * 1000 ).format( this.stopsFormatLabel )
          } );
        }
      }
      return stops.filter( item => {
        return item.percent <= 100 && item.percent >= 0;
      } );
    },
    moveRange() {
      return [ this.minValue, this.maxValue ];
    },
    minValuePos() {
      if ( this.minValue ) {
        return ( this.minValue - this.min ) / this.timeDiff * 100;
      }
      return 0;
    },
    minValueTooltip() {
      if ( this.minValue ) {
        return this.isUTC ? moment( this.minValue * 1000 ).utc().format( this.formatTooltip ) : moment( this.minValue * 1000 ).format( this.formatTooltip );
      }
      return "";
    },
    maxValuePos() {
      if ( this.maxValue ) {
        return ( this.maxValue - this.min ) / this.timeDiff * 100;
      }
      return 0;
    },
    maxValueTooltip() {
      if ( this.maxValue ) {
        return this.isUTC ? moment( this.maxValue * 1000 ).utc().format( this.formatTooltip ) : moment( this.maxValue * 1000 ).format( this.formatTooltip );
      }
      return "";
    },
    currentValuePos() {
      if ( this.currentValue ) {
        return ( this.currentValue - this.min ) / this.timeDiff * 100;
      }
      return 0;
    },
    currentValueTooltip() {
      if ( this.currentValue ) {
        return this.isUTC ? moment( this.currentValue * 1000 ).utc().format( this.formatTooltip ) : moment( this.currentValue * 1000 ).format( this.formatTooltip );
      }
      return "";
    },
  },
  watch: {
    selectRange() {
      if ( this.selectRange.length === 2 ) {
        this.minValue =  this.selectRange[ 0 ];
        this.maxValue =  this.selectRange[ 1 ];
        const min = Math.min( this.range[ 0 ], this.range[ 1 ] );
        if ( this.minValue < min ) {
          this.minValue = min;
        }
        const max = Math.max( this.range[ 0 ], this.range[ 1 ] );
        if ( this.maxValue > max ) {
          this.maxValue = max;
        }
      }
    },
    minValuePos() {
      this.changeMinValueTooltipTransform( "minValue" )
    },
    maxValuePos() {
      this.changeMinValueTooltipTransform( "maxValue" )
    },
    currentValuePos() {
      this.changeMinValueTooltipTransform( "currentValue" )
    },
    selectTime() {
      this.currentValue = this.selectTime;
    },
    disabled() {
      // TODO 如果 为 true 则 卸载 监听拖动/点击的事件， 反之亦然
      if ( this.disabled ) {
        this.destroyEvents();
      } else {
        this.bindEvents();
      }
    },
    // 当前值，最小选择范围，最大选择范围 同时存在并变化时
    // 当前值 < 最小值 ， 当前值 > 最大值
    minValue() {
      if ( this.currentValue !== undefined ) {
        if ( this.minValue > this.currentValue ) {
          this.currentValue = this.minValue;
        }
      }
    },
    maxValue() {
      if ( this.currentValue !== undefined ) {
        if ( this.maxValue < this.currentValue ) {
          this.currentValue = this.maxValue;
        }
      }
    },
    moveRange() {
      if ( !this.dragDom ) {
        this.emitSelectRange();
      }
    },
    currentValue() {
      if ( this.maxValue !== undefined && this.minValue !== undefined ) {
        if ( this.maxValue < this.currentValue ) {
          this.maxValue = this.currentValue;
        }
        if ( this.minValue > this.currentValue ) {
          this.minValue = this.currentValue;
        }
      }
      if ( !this.dragDom ) {
        this.emitSelectTime();
      }
    },
  },
  methods: {
    bindEvents() {
      if ( !this.$el.querySelector ) {
        return;
      }
      this.container = document.querySelector( "body" );
      this.runway = this.$el.querySelector( ".timeline__runway" );

      // 给范围条添加移动事件
      this.barBox = this.$el.querySelector( ".timeline__barBox" );
      if ( this.barBox ) {
        this.barBox.addEventListener( "mousedown", this.barMousedownEvent.bind( this, this.barBox ) );
      }

      // 给左右点添加移动事件
      this.leftPoint = this.$el.querySelector( ".leftPoint" );
      if ( this.leftPoint ) {
        this.leftPoint.addEventListener( "mousedown", this.pointMousedownEvent.bind( this, this.leftPoint, "leftPoint" ) );
      }

      this.rightPoint = this.$el.querySelector( ".rightPoint" );
      if ( this.rightPoint ) {
        this.rightPoint.addEventListener( "mousedown", this.pointMousedownEvent.bind( this, this.rightPoint, "rightPoint" ) );
      }


      // 给当前时间点添加移动事件
      this.curPoint = this.$el.querySelector( ".curPoint" );
      if ( this.curPoint ) {
        this.curPoint.addEventListener( "mousedown", this.pointMousedownEvent.bind( this, this.curPoint, "curPoint" ) );
      }

    },
    destroyEvents() {
      if ( this.barBox ) {
        this.barBox.removeEventListener( "mousedown", this.barMousedownEvent );
      }
      if ( this.leftPoint ) {
        this.leftPoint.removeEventListener( "mousedown", this.pointMousedownEvent );
      }
      if ( this.leftPoint ) {
        this.leftPoint.removeEventListener( "mousedown", this.pointMousedownEvent );
      }
      if ( this.curPoint ) {
        this.curPoint.removeEventListener( "mousedown", this.pointMousedownEvent );
      }
    },
    barMousedownEvent( container, event ) {
      event.stopPropagation();
      this.dragDom = container;
      this.barMousedownclientX = event.clientX;
      this.minValueLabelVisiable = true;
      this.maxValueLabelVisiable = true;

      const mousemove = ( event ) => {
        event.stopPropagation();
        if ( this.dragDom ) {
          this.changeBarPos( event );
        }
      };
      const mouseup = ( event ) => {
        event.stopPropagation();
        this.dragDom =  null;
        container.style.cursor = "auto";
        // TODO 通知父组件 选择范围变化

        if ( this.maxValue && this.minValue ) {
          this.minValue = Math.round( this.minValue );
          this.maxValue = Math.round( this.maxValue );
        }

        if ( this.selectTime ) {
          this.currentValue = Math.round( this.currentValue );
        }

        this.minValueLabelVisiable = false;
        this.maxValueLabelVisiable = false;
        this.container.removeEventListener( "mousemove", mousemove, false );
        this.container.removeEventListener( "mouseup", mouseup, false );
      };
      this.container.addEventListener( "mousemove", mousemove );
      this.container.addEventListener( "mouseup", mouseup );
      container.style.cursor = "ew-resize";
    },
    changeBarPos( event ) {
      // 通过移动事件 计算 minValue, maxValue
      let minValuePos = this.minValuePos;
      let maxValuePos = this.maxValuePos;

      const movePercent = ( event.clientX - this.barMousedownclientX ) / this.runway.getBoundingClientRect().width * 100;

      if( minValuePos <= 0 && movePercent < 0 || minValuePos + movePercent < 0 ) {
        return;
      } else if ( maxValuePos >= 100 && movePercent > 0 || maxValuePos + movePercent > 100 ) {
        return;
      }

      minValuePos += movePercent;
      maxValuePos += movePercent;

      let minValue = this.min + minValuePos / 100 * this.timeDiff;
      let maxValue = this.min + maxValuePos / 100 * this.timeDiff;

      this.minValue = minValue;
      this.maxValue = maxValue;

      this.barMousedownclientX = event.clientX;
    },
    pointMousedownEvent( container, type, event ) {
      event.stopPropagation();
      this.dragDom = container;

      this.pointMousedownclientX = event.clientX;

      const mousemove = ( event ) => {
        event.stopPropagation();
        if ( this.dragDom ) {
          if ( type === "leftPoint" ) {
            this.minValueLabelVisiable = true;
          } else if ( type === "rightPoint" ) {
            this.maxValueLabelVisiable = true;
          } else if ( type === "curPoint" ) {
            this.currentValueVisiable = true;
          }
          this.changePointPosition( type, event );
        }
      };
      const mouseup = ( event ) => {
        event.stopPropagation();
        this.dragDom =  null;
        container.style.cursor = "auto";

        if ( type === "leftPoint" ) {
          this.minValueLabelVisiable = false;
        } else if ( type === "rightPoint" ) {
          this.maxValueLabelVisiable = false;
        } else if ( type === "curPoint" ) {
          this.currentValueVisiable = false;
        }

        if ( this.maxValue && this.minValue ) {
          this.minValue = Math.round( this.minValue );
          this.maxValue = Math.round( this.maxValue );
        }
        if ( this.selectTime ) {
          this.currentValue = Math.round( this.currentValue );
        }
        this.container.removeEventListener( "mousemove", mousemove, false );
        this.container.removeEventListener( "mouseup", mouseup, false );
      };
      this.container.addEventListener( "mousemove", mousemove );
      this.container.addEventListener( "mouseup", mouseup );
      container.style.cursor = "ew-resize";
    },
    changePointPosition( type, event ) {
      let currentValuePos = this.currentValuePos;
      let minValuePos = this.minValuePos;
      let maxValuePos = this.maxValuePos;
      const movePercent = ( event.clientX - this.pointMousedownclientX ) / this.runway.getBoundingClientRect().width * 100;
      if ( type === "curPoint" ) {
        if( currentValuePos <= 0 && movePercent < 0 || currentValuePos + movePercent < 0  ) {
          return;
        } else if ( currentValuePos >= 100 && movePercent > 0 || currentValuePos + movePercent > 100 ) {
          return;
        }
        currentValuePos += movePercent;

        let currentValue = this.min + currentValuePos / 100 * this.timeDiff;

        if ( this.maxSelectRange && ( currentValue - this.minValue > this.maxSelectRange || this.maxValue - currentValue > this.maxSelectRange ) ) {
          return;
        }

        this.currentValue = currentValue;
      } else {
        if( type === "leftPoint" && ( minValuePos <= 0 && movePercent < 0 || minValuePos + movePercent < 0 || minValuePos + movePercent > maxValuePos ) ) {
          return;
        } else if ( type === "rightPoint" && ( maxValuePos >= 100 && movePercent > 0 || maxValuePos + movePercent > 100 || maxValuePos + movePercent < minValuePos ) ) {
          return;
        }
        // 最大最小值变化时  如果存在最大选择范围 maxSelectRange 则需要判断差值

        if ( type === "leftPoint" ) {
          minValuePos += movePercent;
        } else if ( type === "rightPoint" ) {
          maxValuePos += movePercent;
        }
        let minValue = this.min + minValuePos / 100 * this.timeDiff;
        let maxValue = this.min + maxValuePos / 100 * this.timeDiff;
        if ( this.maxSelectRange && maxValue - minValue > this.maxSelectRange ) {
          return;
        }

        this.minValue = minValue;
        this.maxValue = maxValue;
      }

      this.pointMousedownclientX = event.clientX;
    },
    onSelect( event, value ) {
      let val = value;
      if ( val === undefined ) {
        // 通过点击距离计算 value
        if ( event.target.className === "timeline__barBox" ) {
          return;
        }
        const pos = ( event.clientX - this.runway.getBoundingClientRect().x ) / this.runway.getBoundingClientRect().width * 100;

        val = Math.round( this.min + pos / 100 * this.timeDiff );
      }

      // 就近原则 参见readme.md
      if ( this.selectTime && this.selectRange.length === 0 ) {
        // 仅存在 点选择
        this.changeCurValuePosBySelect( val );
      } else if ( this.selectRange.length === 2 && !this.selectTime ) {
        // 仅存在 范围选择
        this.changeBarPosBySelect( val );
      } else {
        // 两种同时存在
        if ( val >= this.minValue && val <= this.maxValue ) {
          this.changeCurValuePosBySelect( val );
        } else {
          this.changeBarPosBySelect( val );
        }
      }
    },
    changeCurValuePosBySelect( val ) {
      this.currentValue = val;
    },
    changeBarPosBySelect( val ) {
      const minDiff = Math.abs( this.minValue - val );
      const maxDiff = Math.abs( this.maxValue - val );
      let minValue = this.minValue;
      let maxValue = this.maxValue;
      if ( minDiff < maxDiff ) {
        minValue = val;
      } else if ( minDiff > maxDiff ) {
        maxValue = val;
      }
      if ( this.maxSelectRange && maxValue - minValue > this.maxSelectRange ) {
        return;
      }
      this.minValue = minValue;
      this.maxValue = maxValue;
    },
    emitSelectRange() {
      if ( this.$listeners.changeSelectRange ) {
        this.$emit( "changeSelectRange", [ this.minValue, this.maxValue ] );
      }

    },
    emitSelectTime() {
      if ( this.$listeners.changeSelectTime ) {
        this.$emit( "changeSelectTime", this.currentValue );
      }
    },
    changeMinValueTooltipTransform(type) {
      let transform = -50
      let pointWidth = {
        minValueTooltipWidth: this.$el.querySelector(".timeline_custom__label--min") ? this.$el.querySelector(".timeline_custom__label--min").offsetWidth : 0,
        maxValueTooltipWidth: this.$el.querySelector(".timeline_custom__label--max") ? this.$el.querySelector(".timeline_custom__label--max").offsetWidth : 0,
        currentValueTooltipWidth: this.$el.querySelector(".timeline_custom__label--cur") ? this.$el.querySelector(".timeline_custom__label--cur").offsetWidth : 0,
      }
      const elWidth = this.$el.offsetWidth

      if ( this[`${type}Pos`] * elWidth / 100 - pointWidth[`${type}TooltipWidth`] / 2 <= 0 ) {
        transform = Math.abs( ( this[`${type}Pos`] * elWidth / 100 - pointWidth[`${type}TooltipWidth`] / 2 ) / ( pointWidth[`${type}TooltipWidth`] / 2 ) * 50 ) - 50;
      }
      if ( this[`${type}Pos`] * elWidth / 100 + pointWidth[`${type}TooltipWidth`] / 2 >= elWidth ) {
        transform = - ( ( this[`${type}Pos`] * elWidth / 100 + pointWidth[`${type}TooltipWidth`] / 2 - elWidth ) / ( pointWidth[`${type}TooltipWidth`] / 2 ) * 50 ) - 50;
      }

      this[`${type}TooltipTransform`] = transform
    }
  },
  created() {
  },
  mounted() {
    this.bindEvents();
  },
  beforeDestroy() {
    this.destroyEvents();
  },
};
</script>

<style lang="less">
@white: #FFFFFF;
@titleColor: #55647D;
@borderColor: #E9E9E9;
@defaultBlue: #3AB7F8;
@tableColor: #666666;
@fontDarkColor: #333333;
@disabledColor: #CCCCCC;
@hoverColor: #3B99FC;
@placeholderColor: #999999;
@paginationBorderColor: #DEDEDE;
@bgColor: #F7F7FC;
@bgLightColor: #f8f8f8;

.timeline {
    position: relative;
    user-select: none;

    padding: 0 10px;

    &.disabled {
        cursor: not-allowed;
    }

    .timeline__runway {
        width: 100%;
        height: 6px;
        margin: 18px 0;
        background-color: @disabledColor;
        border-radius: 3px;
        position: relative;
        vertical-align: middle;
        cursor: pointer;

        .timeline__barBox {
            height: 30px;
            position: absolute;
            top: -11px;

            .timeline__bar {
                position: relative;
                top: 11px;
                height: 6px;
                background-color: #409eff;
                border-top-left-radius: 3px;
                border-bottom-left-radius: 3px;
                pointer-events: none;
            }
        }

        .timeline__range_wrapper {
            position: absolute;
            top: -6px;
            transform: translateX(-50%);
            width: 18px;
            height: 18px;
            z-index: 1;
        }

        .timeline__stop {
            position: absolute;
            height: 6px;
            width: 6px;
            border-radius: 100%;
            background-color: @white;
            transform: translateX(-50%);
            cursor: pointer;
        }
        .timeline__stop:first-child {
            transform: translateX(0%);
        }

        .timeline__stop:last-child {
            transform: translateX(-100%);
        }

        .timeline__marks-label {
            position: absolute;
            transform: translateX(-50%);
            font-size: 12px;
            color: @placeholderColor;
            margin-top: 10px;
            white-space: nowrap;
            cursor: pointer;
        }
        .timeline__marks-label:first-child {
            transform: translateX(0%);
        }
        .timeline__marks-label:last-child {
            transform: translateX(-100%);
        }

        .timeline__pointer {
            position: absolute;
            transform: translateX(-50%);
            top: -6px;
            width: 18px;

            .timeline__pointer_icon {
                background: url('../../assets/icon-currentTime.png') no-repeat;
                background-size: 100%;
                width: 18px;
                height: 26px;
                position: absolute;
                top: -19px;
                transform: translateX(0);
                z-index: 2;
            }
            .timeline__pointer_icon:hover {
                transform: scale(1.2)
            }
            .timeline__pointer_icon:focus {
                outline: none;
            }
        }

        .timeline_custom__label {
            position: absolute;
            top: 18px;
            transform: translateX(-50%);
            left: 7px;
            font-size: 13px;
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.4);
            border-radius: 9px;
            opacity: 0.4;
            white-space: nowrap;
            padding: 0 6px;
            text-align: center;
            background: #000000;
            color: @white;
        }

        .timeline_button {
            width: 12px;
            height: 12px;
            border: 3px solid #409eff;
            background-color: #fff;
            border-radius: 50%;
            user-select: none;
        }

        .timeline_button:hover {
            transform: scale(1.2)
        }

        .timeline_button:focus {
            outline: none;
        }
    }
}
</style>
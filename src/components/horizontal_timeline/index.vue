<template>
  <div class="horizontal-timeline">
    <div
      :class="[
        'timeline_leftBtn',
        'timeline_btn',
        isDisableLeftBtn ? 'disabled' : '',
      ]"
      v-if="!(isDisableLeftBtn && isDisableRightBtn)"
      @click="prev()"
    >
      <span class="el-icon-arrow-left btn_icon"></span>
    </div>
    <div class="timeline_runway">
      <div class="timeline__bar"></div>
      <div
        class="timeline_point"
        v-for="(item, index) in pointData"
        :key="index"
        :style="{ left: item.leftPos + '%' }"
      >
        <div class="point_name">{{ item.name }}</div>
        <div class="point_circle" :style="{ 'border-color': item.color }"></div>
        <div class="point_time">{{ item.end_date }}</div>
      </div>
    </div>
    <div
      :class="[
        'timeline_rightBtn',
        'timeline_btn',
        isDisableRightBtn ? 'disabled' : '',
      ]"
      v-if="!(isDisableLeftBtn && isDisableRightBtn)"
      @click="next()"
    >
      <span class="el-icon-arrow-right btn_icon"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "HorizontalTimeline",
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      blockWidth: 150,
      barWidth: 0,
      resizeTimer: null,
      startAt: 0,
    };
  },
  computed: {
    isDisableLeftBtn() {
      return this.startAt <= 0;
    },
    isDisableRightBtn() {
      return this.startAt + this.windowCount >= this.data.length;
    },
    windowCount() {
      return parseInt(this.barWidth / this.blockWidth) > this.data.length
        ? this.data.length
        : parseInt(this.barWidth / this.blockWidth);
    },
    pointData() {
      if (!this.barWidth) return;
      let freeWidth = 0;
      let padding = 0;
      freeWidth = this.barWidth - this.blockWidth * this.windowCount;
      padding = freeWidth / (this.windowCount + 1);

      const paddingPos = (padding / this.barWidth) * 100;
      const blockPos = (this.blockWidth / this.barWidth) * 100;

      return this.data.map((item, i) => {
        item.leftPos = paddingPos + blockPos / 2 + (blockPos + paddingPos) * (i - this.startAt);
        return item;
      });
    },
  },
  methods: {
    bindEvents() {
      window.addEventListener("resize", () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.barWidth = this.$el
            .querySelector(".timeline__bar")
            .getBoundingClientRect().width;
          this.startAt = 0;
        }, 250);
      });
    },
    prev() {
      if (this.startAt > 0) {
        this.startAt--;
      }
    },
    next() {
      if (this.startAt + this.windowCount < this.data.length) {
        this.startAt++;
      }
    },
  },
  mounted() {
    this.barWidth = this.$el
      .querySelector(".timeline__bar")
      .getBoundingClientRect().width;
    this.bindEvents();
  },
};
</script>

<style lang="less" scoped>
@white: #ffffff;
@titleColor: #55647d;
@borderColor: #e9e9e9;
@defaultBlue: #3ab7f8;
@tableColor: #666666;
@fontDarkColor: #333333;
@disabledColor: #cccccc;
@hoverColor: #3b99fc;
@placeholderColor: #999999;
@paginationBorderColor: #dedede;
@bgColor: #f7f7fc;
@bgLightColor: #f8f8f8;

.horizontal-timeline {
  display: flex;
  .timeline_btn {
    width: 24px;
    height: 24px;
    border: 1px solid @disabledColor;
    border-radius: 50%;
    text-align: center;
    margin-top: 30px;
    cursor: pointer;
    &.disabled {
      cursor: not-allowed;
    }
    &.disabled:hover {
      border: 1px solid @disabledColor;
    }
    .btn_icon {
      line-height: 24px;
    }
    .btn_icon:hover {
      color: @hoverColor;
    }
  }
  .timeline_btn:hover {
    border: 1px solid @hoverColor;
  }
  .timeline_runway {
    width: 100%;
    padding: 30px 10px;
    height: 30px;
    overflow: hidden;
    .timeline__bar {
      position: relative;
      top: 12px;
      width: 100%;
      height: 4px;
      background-color: @disabledColor;
      border-radius: 2px;
    }
    .timeline_point {
      display: inline-block;
      position: relative;
      font-size: 12px;
      text-align: center;
      .point_name {
        width: 100px;
        position: absolute;
        top: -40px;
        transform: translateX(-40px);
      }
      .point_circle {
        position: absolute;
        top: -16px;
        width: 16px;
        height: 16px;
        border: 2px solid @defaultBlue;
        background-color: @white;
        border-radius: 50%;
      }
      .point_time {
        width: 100px;
        position: absolute;
        top: 10px;
        transform: translateX(-40px);
      }
    }
  }
}
</style>
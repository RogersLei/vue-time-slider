<template>
  <div id="app">
    <timeline-slider :range="[1588223700, 1588226700]" :show-stops="true" :selectRange="[1588226300, 1588226700]"></timeline-slider>
    <horizontal-timeline :data="horizontalData"></horizontal-timeline>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      horizontalData: [
        {
          id: 27,
          project_id: 110,
          name: "POC功能完善",
          schedule_date: "2020-08-04",
          end_date: "2020-08-06",
          progress: 100,
          weight: 1,
          delay_date: 2,
          color: "#e6a23c",
        },
        {
          id: 28,
          project_id: 110,
          name: "2技术迁移",
          schedule_date: "2020-08-18",
          end_date: "2020-08-19",
          progress: 100,
          weight: 1,
          delay_date: 1,
          color: "#f56c6c",
        },
        {
          id: 29,
          project_id: 110,
          name: "3资源展示",
          schedule_date: "2020-08-31",
          end_date: "2020-09-02",
          progress: 100,
          weight: 3,
          delay_date: 2,
          color: "#f56c6c",
        },
        {
          id: 46,
          project_id: 110,
          name: "资源bug修复",
          schedule_date: "2020-09-17",
          end_date: "2020-09-17",
          progress: 100,
          weight: 1,
          delay_date: 0,
          color: "#67c23a",
        },
        {
          id: 30,
          project_id: 110,
          name: "4组合及阶段",
          schedule_date: "2020-09-21",
          end_date: "2020-09-22",
          progress: 100,
          weight: 2,
          delay_date: 1,
          color: "#67c23a",
        },
        {
          id: 31,
          project_id: 110,
          name: "优化及修复",
          schedule_date: "2020-09-30",
          end_date: "2020-09-29",
          progress: 100,
          weight: 2,
          delay_date: -1,
          color: "#3ab7f8",
        },
      ],
    };
  },
};
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 40px;
  overflow: hidden;
  padding: 20px;
}
.horizontal-timeline {
  margin-top: 40px;
}
</style>

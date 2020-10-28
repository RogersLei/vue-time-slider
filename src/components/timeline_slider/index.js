import Vue from "vue"
import Timeline from "./index.vue";

import {
  Tooltip,
} from 'element-ui';
import "element-ui/lib/theme-chalk/index.css";

Vue.use(Tooltip)

/* istanbul ignore next */
Timeline.install = function( Vue ) {
  Vue.component( Timeline.name, Timeline );
};

export default Timeline;
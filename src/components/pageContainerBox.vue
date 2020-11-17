<template>
  <div class="page-container-box" :class="[option_isFix ? 'isfix' : '']" ref="pagebox">
    <img src="../assets/page_back_hd.jpg" class="bk" />
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      option_W: 0,
      option_H: 0,
      option_isFix: this.config.isfix
    }
  },
  created() {},
  components: {},
  computed: {},
  methods: {
    setScale() {
      const dom = this.$refs['pagebox']
      const current_W = document.body.clientWidth
      const current_H = document.body.clientHeight
      const w_scale = current_W / this.option_W
      const h_scale = current_H / this.option_H
      !this.option_isFix && dom && (dom.style.transform = `scale(${w_scale}, ${h_scale})`)
    },
    initSize() {
      const dom = this.$refs['pagebox']
      if (this.config && this.config.width && this.config.height) {
        this.option_W = this.config.width
        this.option_H = this.config.height
      } else {
        this.option_W = window.screen.width
        this.option_H = window.screen.height
      }
      dom.style.width = `${this.option_W}px`
      dom.style.height = `${this.option_H}px`
    },
    updateScale() {
      window.addEventListener('resize', this.setScale)
    }
  },
  mounted() {
    this.initSize()
    this.setScale()
    this.updateScale()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setScale)
  }
}
</script>
<style lang="scss" scoped>
.page-container-box {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  transform-origin: left top;
  z-index: 999;
  color: #fff;
  //   background-image: linear-gradient(90deg, rgba(125, 186, 243, 0.075) 2px, transparent 0), linear-gradient(rgba(121, 183, 241, 0.075) 2px, transparent 0);
  //   background-size: 35px 35px;
  &.isfix {
    position: relative;
    // background-image: linear-gradient(90deg, #0e2251 0%, #1b437b 25%, #2e6ca7 50%, #1b437b 75%, #0e2251 100%);
    // background-size: unset;
  }
}
</style>

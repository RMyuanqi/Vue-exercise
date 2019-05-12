<template>
  <div class="Cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <div class="inner icon-remove_circle_outline"></div>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script>
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart() {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit('add', event.target);
      },
      decreaseCart() {
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "../../common/css/mixin";
  @import "../../common/css/icon.css";

  .Cartcontrol {
    font-size: 0;
    .cart-decrease {
      display: inline-block;
      padding: 6px 0 6px 6px;
      opacity: 1;
      transform: translate3D(0, 0, 0);
      .inner {
        display: inline-block;
        font-size: 26px;
        line-height: 26px;
        color: #2d97fc;
        transition: all 0.4s linear;
        transform: rotate(0);
      }
      &.move-enter-active, &.move-leave-active {
        transition: all 0.2s linear;
      }
      &.move-enter, &move-leave-to {
        opacity: 0;
        transform: translate3D(180, 0, 0);
        &.inner {
          transform: rotate(180deg)
        }
      }
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 23px;
      padding-top: 6px;
      text-align: center;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: rgb(78, 78, 78);
    }
    .cart-add {
      display: inline-block;
      padding: 6px 6px 6px 0;
      font-size: 26px;
      line-height: 26px;
      color: #2d97fc;
    }
  }
</style>

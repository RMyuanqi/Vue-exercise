<template>
  <div>

    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item"
              :class="{'current': currentIndex === index}"
              @click="selectMenu(index, $event)" ref="menuList">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="foods-list" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" :key="index" class="food-item border-1px"
                  @click="selectFood(food, $event)">
                <div class="icon">
                  <img :src="food.icon" width="70" height="70" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now"><span class="sign">￥</span>{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <Cartcontrol :food="food" @add="addFood"></Cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCar ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice"
               :minPrice="seller.minPrice"></ShopCar>
    </div>
    <Food @add="addFood" :food="selectedFood" ref="food"></Food>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import ShopCar from '../../components/shopcar/shopcar.vue';
  import Cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  import Food from '../../components/food/food.vue'
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            this._followScroll(i);
            return i
          }
        }
        return 0
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.$http.get('/api/goods')
        .then((res) => {
          res = res.data;
          if (res.errno === ERR_OK) {
            this.goods = res.data;
            //等价于setTimeOut,一个 Tick 约为 17 ms
            this.$nextTick(() => {
              this._initScroll();
              this._calculateHeight()
            })
          }
        });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // 开启点击事件（BS默认会阻止掉）
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3// 设定BS 实时监测滚动位置
        });
        this.foodsScroll.on('scroll', (position) => {
          // 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
          if (position.y <= 0) {
            this.scrollY = Math.abs(Math.round(position.y))
          }
        })
      },
      _calculateHeight() {
        //每个foodlist的高度就是每个区块的高度
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300)
      },
      addFood(target) {
        this._drop(target)
      },
      _drop(target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      _followScroll() {
        let menuList = this.$refs.menuList;
        let el = menuList[index];
        this.meunScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      ShopCar,
      Cartcontrol,
      Food
    }
  }

</script>
<style lang="scss">
  @import "../../common/css/mixin";
  @import "../../common/css/icon.css";
  @import "../../common/css/base";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
      flex: 0 0 80;
      width: 80px;
      background-color: #f2f5f7;
      .menu-item {
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        &.current {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          .text {
            @include border-none();
            color: #000;
            font-weight: 500;
          }
        }
        .icon {
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease {
            @include bg-img('decrease_3')
          }
          &.discount {
            @include bg-img('discount_3')
          }
          &.guarantee {
            @include bg-img('guarantee_3')
          }
          &.invoice {
            @include bg-img('invoice_3')
          }
          &.special {
            @include bg-img('special_3')
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle; /*在table中居中*/
          @include border-1px(rgba(7, 17, 27, 0.1));
          font-size: 13px;
          color: rgb(78, 78, 78);
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .foods-list {
        .title {
          padding-left: 14px;
          border-left: 2px solid #d9dde1;
          height: 26px;
          line-height: 26px;
          background-color: #f3f5f7;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
        .food-item {
          display: flex;
          margin: 12px;
          padding-bottom: 12px;
          @include border-1px(rgba(7, 17, 27, .1));
          &:last-child {
            margin-bottom: 0;
            @include border-none
          }
          .icon {
            flex: 0 0 57px;
            img {
              border-radius: 2px;
            }
          }
          .content {
            flex: 1;
            margin-left: 12px;
            .name {
              margin: 2px 0 8px;
              font-size: 16px;
              height: 14px;
              line-height: 14px;
              color: rgb(7, 17, 27);
              font-weight: 500;
              width: 136px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .desc, .extra {
              font-size: 10px;
              line-height: 10px;
            }
            .desc {
              margin-bottom: 8px;
              line-height: 10px;
              color: rgb(147, 153, 159)
            }
            .extra {
              color: rgb(78, 78, 78);
              .count {
                margin-right: 12px;
              }
            }
            .price {
              font-size: 0;
              line-height: 24px;
              .sign {
                font-size: 11px;
              }
              .now {
                margin-right: 8px;
                font-weight: 900;
                font-size: 16px;
                color: #fa3a12;
              }
              .old {
                text-decoration: line-through;
                font-size: 10px;
                color: rgb(147, 153, 159);
              }
            }
            .cartcontrol-wrapper {
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
        }
      }
    }
  }
</style>

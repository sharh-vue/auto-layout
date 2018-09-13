<template>
  <div class="layout-page">
    <!-- 组件列表 -->
    <div class="layout-item components">
      <div class="wrapper">
        <ul id="my-list" ref="list">
          <li 
          draggable="true" 
          class="li">
            <div class="move-item"> 
              <img src="http://img2.xiazaizhijia.com/walls/20140825/middle_85359d20308342c.jpg" alt="">
            </div>
          </li>
          <li draggable="true" data-position="absolute" class="li">
            <div class="move-item">
              <img src="http://img4.duitang.com/uploads/item/201206/29/20120629174422_QW3Kh.thumb.700_0.jpeg" alt="">
            </div>
          </li>
          <li draggable="true" class="li">
            <div class="move-item">
              <img src="http://img3.duitang.com/uploads/item/201602/24/20160224105804_3QiBk.thumb.700_0.jpeg" alt="">
            </div>
          </li>
        </ul>
        <component :is="component">attributes</component>
      </div>
    </div>
    <!-- 布局列表 -->
    <div class="layout-item layouts">
      <div class="wrapper">
        <div id="outer-dropzone" class="dropzone">
          
        </div>
      </div>
    </div>
    <!-- 属性列表 -->
    <div class="layout-item attributes">
      <div class="wrapper">
        <div v-for="attr in attributes">
          <label>
            {{attr.name}}
            <input type="text" :name="attr.name" v-model="attr.value">
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import XButton from './components/Button.vue'
let interact = require('interactjs')
export default {
  data(){
    return {
      component: 'x-button',
      activeEl: null,
      attributes: [
        {
          name:'backgroundColor',
          value: '',
          default: ''
        },
        {
          name:'position',
          value: '',
          default: ''
        },
        {
          name:'zIndex',
          value: '',
          default: ''
        }
      ]
    }
  },
  watch: {
    attributes: {
      handler(newVal, oldVal){
        console.log(newVal)
        if(this.activeEl){
          newVal.forEach((val)=>{
            this.activeEl.style[val.name] = val.value
          })
        }
      },
      deep: true
    },
    activeEl(el){
      console.log(el)
      this.attributes.forEach((val)=>{
        if(el.style[val.name]){
          val.value = el.style[val.name]
        }else{
          val.value = val.default;
        }
      })
    }
  },
  components: {
    XButton
  },
  methods: {
    bindDrop(selector){
      var ele = document.querySelector(selector);
      var dragingEl;


      ele.addEventListener('dragstart', function (e) {
          dragingEl = e.target;
          dragingEl.classList.add('draging');
      })
      ele.addEventListener('dragover', function (e) {
        ele.classList.add('drop-active')
          e.preventDefault(); //阻止默认动作
      })
      /*源对象释放，目标对象上触发的事件*/
      ele.addEventListener('drop', function (e) {
          console.log(e)
          ele.classList.remove('drop-active')
          // dragingEl.classList.remove('draging');
          // if (e.target.nodeName === 'LI') {
          //     e.target.parentNode.insertBefore(ele, e.target); //将源对象元素插入到目标元素前面
          // }
      })
    },
    on(eventName, selector, fn){
      document.addEventListener(eventName, function(e){
        // console.log(e);
        for(var i = 0; i < e.path.length - 2; i++){
          var el = e.path[i];
          if(el.tagName.toLowerCase() === selector 
            || '#'+el.getAttribute('id') === selector
            || '.'+el.classList.value.replace(' ', '.') === selector){
            fn && fn.call(el, e);
            // fn && fn.apply(el, [e]);
            // fn && fn.bind(el)(e);
            // fn && fn(e);
            break;
          }
        }
      })
    }
  },
  beforeDestroy(){
    console.log('beforeDestroy')
    $(document).off('dragstart drag dragend dragover dragenter dragleave drop')
  },
  actived(){
    console.log('actived')
  },
  deactived(){
    console.log('deactived')
  },
  mounted(){
    console.log('mounted')
    var vm = this;
    var dragEl;

    $(document).on('dragstart', '#my-list li', function(e){
      dragEl = this;
    })
    .on('click', '.layout-copy', function(e){
      vm.activeEl = this;
    })
    .on('drag', '#my-list li', function(e){

    })
    .on('dragend', '#my-list li', function(e){
      console.log(e.target, 'dragend');
    })
    .on('dragover', '#outer-dropzone', function(e){
      // e.target.classList.add('drop-active')
      e.preventDefault(); //阻止默认动作
    })
    .on('dragenter', '#outer-dropzone', function(e){
      this.classList.add('drop-active')
      console.log('dragenter')
    })
    .on('dragleave', '#outer-dropzone', function(e){
      this.classList.remove('drop-active')
       console.log('dragleave')
    })
    .on('drop', '#outer-dropzone', function(e){
      e.preventDefault(); //阻止默认动作
      // e.target.classList.remove('drop-active')
      var cloneNode = dragEl.cloneNode(true)
      vm.activeEl = cloneNode;
      $(cloneNode).addClass('layout-copy');
      cloneNode.removeAttribute('draggable')
      console.log(e.clientX, e.clientY, e.offsetX, e.offsetY)
      if(cloneNode.getAttribute('data-position') === 'absolute'){
      }
      cloneNode.style.left = e.clientX + 'px';
      cloneNode.style.top = e.clientY + 'px';
      cloneNode.style.position = 'absolute';
      var bound = this.getBoundingClientRect();
      console.log(bound)
      // cloneNode.style.transform = `translate(${e.clientX - bound.x}px, ${e.clientY - bound.y}px)`
      // var dot = document.createElement('div');
      // dot.style = `position: absolute; top: ${e.clientY}px; left: ${e.clientX}px;width: 10px; height: 10px;background: red;`;
      // this.appendChild(dot)
      if(e.target === this){
        this.appendChild(cloneNode)
      }else{
        this.insertBefore(cloneNode, $(e.target).closest('li')[0])
      }

    })

    interact('#outer-dropzone li')
        .draggable({
          snap: {
            targets: [
              interact.createSnapGrid({ x: 30, y: 30 })
            ],
            range: Infinity,
            relativePoints: [ { x: 0, y: 0 } ]
          },
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
          // var textEl = event.target.querySelector('p');

          // textEl && (textEl.textContent =
          //   'moved a distance of '
          //   + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
          //                Math.pow(event.pageY - event.y0, 2) | 0))
          //       .toFixed(2) + 'px');
        }
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: { width: 100, height: 50 },
        },

        inertia: true,
      })
      .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);
        vm.activeEl = target;
        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
      });

        function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
  }
}
</script>

<style scoped>

.layout-item{
  float: left;
}
.layout-page{
  font-size: 0;
}
.wrapper{
  font-size: initial;
}
.components, .attributes{
  width: 200px;
  height: 100px;
}
.li{
  display: block;
  height: 140px;
  width: 100px;
  background: gray;
  margin: 10px 0;
  overflow: hidden;
}
.li img{
  width: 100%;
}

#outer-dropzone {
  min-height: 140px;
  max-height: 100vh;
  overflow: auto;
}


.layouts{
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: calc(100vw - 420px);
}
.grid-item{
  background: gray;
}

.dropzone {
  background-color: #ccc;
  border: dashed 4px transparent;
  border-radius: 4px;
  margin: 10px auto 30px;
  width: 80%;
  transition: background-color 0.3s;
}

.drop-active {
  border: dashed 2px #fff;
  border-color: #aaa;
}

.drop-target {
  background-color: #29e;
  border-color: #fff;
  border-style: solid;
}

.drag-drop {
  display: inline-block;
  min-width: 40px;
  padding: 2em 0.5em;

  color: #fff;
  background-color: #29e;
  border: solid 2px #fff;

  -webkit-transform: translate(0px, 0px);
          transform: translate(0px, 0px);

  transition: background-color 0.3s;
}

.drag-drop.can-drop {
  color: #000;
  background-color: #4e4;
}
</style>



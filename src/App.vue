<template>
  <div class="layout-page">
    <!-- 组件列表 -->
    <div class="layout-item components">
      <div class="wrapper">
        <ul id="my-list" ref="list">
          <li draggable="true" class="li">
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
        <div id="outer-dropzone" class="dropzone"></div>
      </div>
    </div>
    <!-- 属性列表 -->
    <div class="layout-item attributes">
      <div class="wrapper">
        attributes
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
      component: 'x-button'
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
    },
    bindDrag(){
      document.addEventListener('dragstart', function(e){

      })
    }
  },
  mounted(){
    this.bindDrop('#outer-dropzone')
    var dragEl;
    this.on('dragstart', 'li', function(e){
      dragEl = this;
      console.log(this, 'dragstart');
    })
    this.on('drag', 'li', function(e){
      // console.log(e.target, 'drag');
    })
    this.on('dragend', 'li', function(e){
      console.log(e.target, 'dragend');
    })
    this.on('dragover', '#outer-dropzone', function(e){
      e.target.classList.add('drop-active')
      e.preventDefault(); //阻止默认动作
    })
    this.on('dragenter', '#outer-dropzone', function(e){
      console.log('dragenter')
    })
    this.on('dragleave', '#outer-dropzone', function(e){
       console.log('dragleave')
    })
    this.on('drop', '#outer-dropzone', function(e){
      e.target.classList.remove('drop-active')
      var cloneNode = dragEl.cloneNode(true)
      cloneNode.removeAttribute('draggable')
      console.log(e.clientX, e.clientY, e.offsetX, e.offsetY)
      if(cloneNode.getAttribute('data-position') === 'absolute'){
        cloneNode.style.left = e.clientX + 'px';
        cloneNode.style.top = e.clientY + 'px';
        cloneNode.style.position = 'absolute';
      }
      var bound = this.getBoundingClientRect();
      console.log(bound)
      // cloneNode.style.transform = `translate(${e.clientX - bound.x}px, ${e.clientY - bound.y}px)`
      // var dot = document.createElement('div');
      // dot.style = `position: absolute; top: ${e.clientY}px; left: ${e.clientX}px;width: 10px; height: 10px;background: red;`;
      // this.appendChild(dot)
      if(e.target === this){
        this.appendChild(cloneNode)
      }else if(e.target.parentNode == this){
        this.insertBefore(cloneNode, e.target)
      }
      e.preventDefault(); //阻止默认动作
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
        onmove: dragMoveListener,
        // restrict: {
        //   restriction: 'parent',
        //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        // },
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
        var {dx, dy, clientY, clientX, clientX0, clientY0} = event
        console.log(dx, dy, clientY, clientX, clientX0, clientY0)
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
       window.dragMoveListener = dragMoveListener;
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
  border: solid 2px #fff;
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



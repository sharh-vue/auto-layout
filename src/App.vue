<template>
  <div class="layout-page">
    <!-- 组件列表 -->
    <div class="layout-item components">
      <div class="wrapper">
        <ul id="my-list" ref="list">
          <li class="li">
            <div class="move-item"> item 1 </div>
          </li>
          <li class="li">
            <div class="move-item"> item 2 </div>
          </li>
          <li class="li">
            <div class="move-item"> item 3 </div>
          </li>
        </ul>
        <component :is="component">attributes</component>
      </div>
    </div>
    <!-- 布局列表 -->
    <div class="layout-item layouts">
      <div class="wrapper">
        <div id="outer-dropzone" class="dropzone">
          #outer-dropzone
          <div id="inner-dropzone" class="dropzone">#inner-dropzone</div>
        </div>
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
    dragMoveListener (event) {
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.clientX,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.clientY;
      var child;
      if(target._child){
        child = target._child
      }else{
        child = target.firstElementChild;
        target._child = target.firstElementChild
      }
      var cloneNode;
      if(child._cloneNode){
        cloneNode = child._cloneNode;
      }else{
        cloneNode = child.cloneNode(true);
        child._cloneNode = cloneNode;
        target.replaceChild(cloneNode, child)
        document.body.appendChild(child)
      }
      // console.log(cloneNode);
      // document.body.appendChild(cloneNode)
      // translate the element
      child.style.left = x + 'px';
      child.style.top = y + 'px';
      // child.style.webkitTransform =
      // child.style.transform =
      //   'translate(' + x + 'px, ' + y + 'px)';
      // target.setAttribute('data-x', x);
      // target.setAttribute('data-y', y);
    },
    dropZone(){
      interact('.dropzone').dropzone({
      // only accept elements matching this CSS selector
      accept: '.li',
      // Require a 75% element overlap for a drop to be possible
      overlap: 0.75,

      // listen for drop related events:

      ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
      },
      ondragenter: function (event) {
        console.log(event)
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        draggableElement.textContent = 'Dragged in';
      },
      ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.textContent = 'Dragged out';
      },
      ondrop: function (event) {
        console.log(event);
        event.relatedTarget.textContent = 'Dropped';
      },
      ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
      }
    });
    }
  },
  mounted(){
    this.dropZone();
    var interactEl = interact('.li')
    .draggable({
      // enable inertial throwing
      inertia: true,
      // keep the element within the area of it's parent
      // restrict: {
      //   restriction: "parent",
      //   endOnly: true,
      //   elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      // },
      // enable autoScroll
      autoScroll: true,

      // call this function on every dragmove event
      onmove: this.dragMoveListener,
      // call this function on every dragend event
      onend: function (event) {
        event.target._child = null;
        console.log(event)
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
    }) .on('resizemove', function (event) {
      var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);
          console.log(target)
      var cloneNode = target;
      // update the element's style
      cloneNode.style.width  = event.rect.width + 'px';
      cloneNode.style.height = event.rect.height + 'px';

      // translate when resizing from top or left edges
      x += event.deltaRect.left;
      y += event.deltaRect.top;
      // cloneNode.style.left = x + 'px';
      // cloneNode.style.top = x + 'px';
      cloneNode.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

      cloneNode.setAttribute('data-x', x);
      cloneNode.setAttribute('data-y', y);
      // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
    });
    console.log(interactEl)
  }
}
</script>

<style scoped>

.move-item{
  height: 50px;
  width: 50px;
  background: gold;
  z-index: 0;
  position: absolute;
  display: inline-block;
}
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
  background: gray;
  margin: 10px 0;
}

#outer-dropzone {
  height: 140px;
}

#inner-dropzone {
  height: 80px;
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
  padding: 10px;
  width: 80%;
  transition: background-color 0.3s;
}

.drop-active {
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



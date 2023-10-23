<!--
 * @Author: Zero 1689688912@qq.com
 * @Date: 2023-10-23 20:21:30
 * @LastEditors: Zero 1689688912@qq.com
 * @LastEditTime: 2023-10-24 00:10:07
 * @FilePath: \three.js\szzt\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main">
    <div id="screen" class="screen"></div>
  </div>
</template>

<script setup>
import * as THREE from 'three';
import ZThree from '@/three/ZThree.js'
import { loaderModel } from '@/three/loaderModel.js';

let app, camera, scene, renderer, controls, clock;

import { onMounted } from 'vue';

const initZThree = async () => {
  app = new ZThree('screen');
  app.initThree();
  app.initHelper();
  app.initOrbitControls();
  app.initLight();

  window.app = app;
  clock = new THREE.Clock();
  controls = app.controls;
  camera = app.camera;
  camera.position.set(13.53, 20.96, 11.03);
  scene = app.scene;
  renderer = app.renderer;
  
  controls.target.set(0.41, 0.77, 1.36);
  controls.maxPolarAngle = Math.PI /2.2;

  await loaderModel(app);

  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  app.render(() => {
    const delta = clock.getDelta();
    controls.update(delta);
    renderer.render(scene, camera);
  });  
}

onMounted(() => {
  initZThree();
})
</script>

<style>
.main {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.screen {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>

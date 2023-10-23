/*
 * @Author: Zero 1689688912@qq.com
 * @Date: 2023-10-23 20:28:34
 * @LastEditors: Zero 1689688912@qq.com
 * @LastEditTime: 2023-10-23 23:44:34
 * @FilePath: \three.js\szzt\src\three\ZThree.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as THREE from 'three';
import {
    GUI
} from 'three/examples/jsm/libs/lil-gui.module.min';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
import {
    DRACOLoader
} from 'three/addons/loaders/DRACOLoader.js';

export default class ZThree {
    constructor(id) {
        this.id = id;
        this.el = document.getElementById(id);
    }

    // 初始化场景
    initThree() {
        let width = this.el.offsetWidth;
        let height = this.el.offsetHeight;
        this.scene = new THREE.Scene();
        this.textureLoader = new THREE.TextureLoader();
        this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
        this.camera.position.set(30, 30, 30);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.el.append(this.renderer.domElement);

        this.gui = new GUI();

        window.addEventListener('resize', () => {
            this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
            if (this.cssRenderer) {
                this.cssRenderer.setSize(this.el.offsetWidth, this.el.offsetHeight);
            }
        });
    }

    initLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);
    }

    initHelper() {
        this.scene.add(new THREE.AxesHelper(100));
    }

    initOrbitControls() {
        let controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = true;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;
        controls.enablePan = true;

        this.controls = controls;
    }

    loaderModel(option) {
        switch (option.type) {
            case 'gltf':
            case 'glb':
                if (!this.gltfLoader) {
                    this.gltfLoader = new GLTFLoader();
                    let dracoLoader = new DRACOLoader();
                    dracoLoader.setDecoderPath('draco/');
                    this.gltfLoader.setDRACOLoader(dracoLoader);
                }
                this.gltfLoader.load(option.url, option.onLoad, option.onProgress, option.onError);
                break;

            default:
                break;
        }
    }

    iterateLoad(objFileList, onProgress, onAllLoad) {
        let fileIndex = 0;
        let that = this;

        function iterateLoadForIt() {
            that.loaderModel({
                type: objFileList[fileIndex].type,
                url: objFileList[fileIndex].url,
                onLoad: function (object) {
                    if (objFileList[fileIndex].onLoad) {
                        objFileList[fileIndex].onLoad(object);
                    }
                    fileIndex++;
                    if (fileIndex < objFileList.length) {
                        iterateLoadForIt();
                    } else {
                        if (onAllLoad) {
                            onAllLoad();
                        }
                    }
                },
                onProgress: function (xhr) {
                    if (objFileList[fileIndex].onProgress) {
                        objFileList[fileIndex].onProgress(xhr, fileIndex);
                    }
                    if (onProgress) {
                        onProgress(xhr, fileIndex);
                    }
                }
            });
        }

        iterateLoadForIt();
    }

    render(callback) {
        callback();
        this.frameId = requestAnimationFrame(() => this.render(callback));
    }
}
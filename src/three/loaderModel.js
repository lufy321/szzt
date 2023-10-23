/*
 * @Author: Zero 1689688912@qq.com
 * @Date: 2023-10-23 21:38:41
 * @LastEditors: Zero 1689688912@qq.com
 * @LastEditTime: 2023-10-23 23:42:40
 * @FilePath: \three.js\szzt\src\three\loaderModel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as THREE from 'three';

export function loaderModel(app) {
    return new Promise((resolve) => {
        let urls = [{
            type: 'glb',
            url: 'model/model.glb',
            onLoad: (object) => {
                console.log(object);
                app.scene.add(object.scene);
            }
        }];

        let urlsLength = urls.length;
        app.iterateLoad(urls, null, () => {
            resolve();
        });

    })
}
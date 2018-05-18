/*
  Copyright 2018 Mei Akizuru

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

import Quagga from "quagga";

class App {
    async main() {
        /*
        const mediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: {exact: 'environment'}}});
        const videoElement = <HTMLVideoElement>document.querySelector('#cameraview');
        videoElement.src = window.URL.createObjectURL(mediaStream);
        videoElement.onloadedmetadata = () => {
            setInterval(this.codeHandler, 1000);
        }
        */
        const resultsList = <HTMLUListElement>document.querySelector('#results')!

        await new Promise((resolve, reject) => Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#viewport')!,
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ['ean_reader'],
                debug: {
                    drawBoundingBox: true,
                    drawScanline: true
                },
                multiple: true
            }
        }, (err) => { if (err) { reject(err); } else { resolve(); } }));
        Quagga.onDetected((rawData) => {
            const data = Array.isArray(rawData) ? rawData : [rawData];
            data.forEach(resultObj => {
                if (resultObj.codeResult) {
                    console.log(resultObj);
                    resultsList.appendChild(this.generateListItem(resultObj.codeResult.code.toString()));
                }
            });
        });
        Quagga.start();
    }

    generateListItem(value: string): HTMLLIElement {
        const li = <HTMLLIElement>document.createElement('li');
        li.textContent = value;
        return li;
    }
}

new App().main();
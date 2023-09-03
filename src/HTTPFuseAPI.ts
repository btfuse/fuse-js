
/*
Copyright 2023 Norman Breau 

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

import {FuseAPI, FuseAPIContentType, TFuseAPIArgs} from './FuseAPI';

/**
 * A Fuse API implementation that uses HTTP protocol to make native calls
 */
export class HTTPFuseAPI extends FuseAPI {
    
    protected _getEndpoint() {
        return '';
    }

    protected _initHeaders(xhr: XMLHttpRequest): void {};

    protected override _execute(pluginID: string, method: string, contentType: FuseAPIContentType, args: TFuseAPIArgs): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('POST', `${this._getEndpoint()}${this._createRoute(pluginID, method)}`);
            
            switch (contentType) {
                case FuseAPIContentType.BINARY:
                    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                    break;
                case FuseAPIContentType.JSON:
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    break;
                case FuseAPIContentType.STRING:
                    xhr.setRequestHeader('Content-Type', 'text/plain');
                    break;
            }

            this._initHeaders(xhr);

            xhr.onload = () => {
                resolve(xhr.response);
            };

            xhr.onerror = (e) => {
                // TODO: Wrap in custom FuseError
                reject(e);
            };
            
            if (args) {
                xhr.send(JSON.stringify(args));
            }
            else {
                xhr.send();
            }
        });
    }
}

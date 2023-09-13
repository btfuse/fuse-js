
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

import { ContentType } from './ContentType';
import {FuseAPI, TFuseAPIArgs} from './FuseAPI';
import { FuseAPIResponse } from './FuseAPIResponse';
import {FuseError} from './FuseError';

/**
 * A Fuse API implementation that uses HTTP protocol to make native calls
 */
export class HTTPFuseAPI extends FuseAPI {
    
    protected _getEndpoint() {
        return '';
    }

    protected _initHeaders(xhr: XMLHttpRequest): void {};

    protected override _execute(pluginID: string, method: string, contentType: string, args: TFuseAPIArgs): Promise<FuseAPIResponse> {
        return new Promise<FuseAPIResponse>((resolve, reject) => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('POST', `${this._getEndpoint()}${this._createRoute(pluginID, method)}`);

            if (!contentType) {
                contentType = ContentType.BINARY;
            }

            if (contentType) {
                xhr.setRequestHeader('Content-Type', contentType);
            }

            this._initHeaders(xhr);

            xhr.onload = async () => {
                let response: FuseAPIResponse = new FuseAPIResponse(xhr.response, xhr.getAllResponseHeaders(), xhr.status);
                if (response.isError()) {
                    reject(await response.readAsError());
                }
                else {
                    resolve(response);
                }
            };

            xhr.onerror = (e) => {
                reject(new FuseError('FuseAPI', 'Network Error'));
            };

            xhr.ontimeout = (e) => {
                reject(new FuseError('FuseAPI', 'API Timeout'));
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

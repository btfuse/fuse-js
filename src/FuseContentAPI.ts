
// /*
// Copyright 2023 Norman Breau 

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// */

// import {FuseAPI} from './FuseAPI';
// import * as UUID from 'uuid';

// interface INativeCallbackRawData {
//     status: number;
//     callbackID: string;
//     retain?: boolean;
//     contentType: string;
//     payload: string;
// }

// interface INativeCallbackData {
//     status: number;
//     callbackID: string;
//     retain?: boolean;
//     contentType: string;
//     payload: Blob;
// }

// export type TNativeCallbackFunction = (data: INativeCallbackData) => void;

// declare global {
//     interface Window {
//         __nbsfuse_callbacks: Map<string, TNativeCallbackFunction>;
//         __nbsfuse_doCallback: (data: INativeCallbackRawData) => void;
//     }
// }

// window.__nbsfuse_callbacks = new Map();

// window.__nbsfuse_doCallback = function(data: INativeCallbackRawData) {
//     if (data.callbackID) {
//         let blob: Blob;
//         if (data.payload) {
//             blob = new Blob([window.atob(data.payload)], {type: data.contentType || 'application/octet-stream'});
//         }
//         else {
//             blob = null;
//         }

//         window.__nbsfuse_callbacks.get(data.callbackID)({
//             ...data,
//             payload: blob
//         });
//     }
// };

// export type TFuseAPICallbackHandler = (error: unknown, data?: Blob) => void;

// /**
//  * A base class for content handler style briding API
//  * 
//  * @experimental
//  */
// export abstract class FuseContentAPI extends FuseAPI {
//     protected _createCallbackContext(cb: TFuseAPICallbackHandler): string {
//         let id: string = UUID.v4();
//         window.__nbsfuse_callbacks.set(id, (data: INativeCallbackData): void => {
//             if (!data.retain) {
//                 window.__nbsfuse_callbacks.delete(id);
//             }

//             if (data.status === 200) {
//                 cb(null, data.payload);
//             }
//             else {
//                 cb(data.payload, null);
//             }
//         });

//         return id;
//     }
// }

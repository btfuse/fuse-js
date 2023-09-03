
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

// import { FuseAPIContentType, TFuseAPIArgs } from "../FuseAPI";
// import { FuseContentAPI } from "../FuseContentAPI";

// declare type TAPIHandlerFunction = (packet: string) => void;

// declare global {
//     interface Window {
//         NBSNative: {
//             __apiHandler: TAPIHandlerFunction;
//         }
//     }
// }

// /**
//  * @experimental
//  */
// export class AndroidContentFuseAPI extends FuseContentAPI {
//     protected _execute(pluginID: string, method: string, contentType: FuseAPIContentType, args: TFuseAPIArgs): Promise<Blob> {
//         return new Promise<Blob>((resolve, reject) => {
//             window.NBSNative.__apiHandler(JSON.stringify({
//                 route: this._createRoute(pluginID, method),
//                 callbackID: (this._createCallbackContext((error: unknown, data: Blob) => {
//                     if (error !== null) {
//                         reject(error);
//                         return;
//                     }

//                     resolve(data);
//                 })),
//                 body: args,
//                 contentType: contentType
//             }));
//         });
//     }
// }

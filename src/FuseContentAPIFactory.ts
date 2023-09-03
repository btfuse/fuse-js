
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

// // TODO: Probably going to be removed

// import { AbstractFuseAPIFactory } from './AbstractFuseAPIFactory';
// import { FuseAPI } from "./FuseAPI";
// import { Platform } from "./Platform";
// import { AndroidContentFuseAPI } from './android/';
// import { IOSContentFuseAPI } from "./ios/IOSContentFuseAPI";

// /**
//  * A FuseAPI factory that uses the content APIs as the bridge.
//  * 
//  * @experimental
//  */
// export class FuseContentAPIFactory extends AbstractFuseAPIFactory {
//     public override create(platform: Platform): FuseAPI {
//         switch (platform) {
//             case Platform.IOS: return new IOSContentFuseAPI();
//             case Platform.ANDROID: return new AndroidContentFuseAPI();
//             default: throw new Error('Unsupported platform: ' + platform);
//         }
//     }
// }

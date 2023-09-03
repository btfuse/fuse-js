
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

// Common API
export {Platform} from './Platform';
export {PlatformResolver} from './PlatformResolver';
export {FuseContext} from './FuseContext';
export {Version} from './Version';
export {
    FuseAPI,
    TFuseAPIArgs,
    TFuseAPISupportedArgPrimitives,
    TFuseAPIResponseData,
    IFuseAPICallPacket,
    FuseAPIContentType
} from './FuseAPI';
export {FuseSubscription} from './FuseSubscription';
export {AbstractFuseAPIFactory} from './AbstractFuseAPIFactory';
// export {FuseContentAPIFactory} from './FuseContentAPIFactory';
export {FusePlugin} from './FusePlugin';
// export {FuseContentAPI, TFuseAPICallbackHandler} from './FuseContentAPI';
export {HTTPFuseAPI} from './HTTPFuseAPI';

// iOS Specific APIs / Implementations
export {IOSSchemeFuseAPI} from './ios/IOSSchemeFuseAPI';

// Android Specific APIs / Implementations
// export {AndroidContentFuseAPI} from './android/AndroidContentFuseAPI';
export {AndroidSchemeFuseAPI} from './android/AndroidSchemeFuseAPI';

// Experimental
// export {FuseSchemeAPIFactory} from './FuseSchemeAPIFactory';
// export {IOSSchemeFuseAPI} from './ios/IOSSchemeFuseAPI';

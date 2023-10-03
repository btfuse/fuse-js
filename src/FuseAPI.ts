
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

import { FuseAPIResponse } from './FuseAPIResponse';
import { TSerializable } from './TSerializable';
import { FuseSerializer } from './FuseSerializer';
import { FuseCallbackManager, TFuseAPICallbackHandler } from './FuseCallbackManager';

/**
 * The primitive data types that the API supports
 */
// export type TFuseAPISupportedArgPrimitives = string | number | boolean | Blob | ArrayBuffer;

/**
 * Supported argument types, which can be any of TFuseAPISupportedArgPrimitives, or a recursive object or array structure of TFuseAPISupportedArgPrimitives
 */
// export type TFuseAPIArgs = TFuseAPISupportedArgPrimitives | RArray<TFuseAPISupportedArgPrimitives | RObj<TFuseAPISupportedArgPrimitives>> | RObj<TFuseAPISupportedArgPrimitives | RArray<TFuseAPISupportedArgPrimitives>>;
// export type TFuseAPIArgs = Blob;

/**
 * Generic API response data type
 */
export interface TFuseAPIResponseData {
    keep: boolean;
    data?: Blob;
}

export interface IFuseAPICallPacket {
    route: string;
    callbackID: string;
    body: Blob;
    contentType: string;
}



/**
 * Base class for the Fuse API bridge for exchanging data with the native platform
 */
export abstract class FuseAPI {

    private $serializer: FuseSerializer;

    public constructor() {
        this.$serializer = this._createSerializer();
    }

    protected _createSerializer(): FuseSerializer {
        return new FuseSerializer();
    }

    public getSerializer(): FuseSerializer {
        return this.$serializer;
    }

    /**
     * Override to implement execute native bridge logic
     * 
     * @param pluginID 
     * @param method 
     * @param args 
     */
    protected abstract _execute(pluginID: string, method: string, contentType: string, args: Blob): Promise<FuseAPIResponse>;

    protected _createRoute(pluginID: string, method: string): string {
        return `/api/${pluginID}${method}`;
    }

    public async execute(pluginID: string, method: string, contentType: string, args: TSerializable): Promise<FuseAPIResponse> {
        return this._execute(pluginID, method, contentType, this.$serializer.serialize(args));
    }

    public createCallbackContext(cb: TFuseAPICallbackHandler): string {
        return FuseCallbackManager.getInstance().createCallback(cb);
    }

    public releaseCallback(id: string): void {
        FuseCallbackManager.getInstance().releaseCallback(id);
    }
}

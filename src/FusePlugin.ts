
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

import { AbstractFuseAPIFactory } from "./AbstractFuseAPIFactory";
import { FuseAPI, TFuseAPIArgs, TFuseAPICallbackHandler } from "./FuseAPI";
import { FuseContext } from "./FuseContext";
import {FuseAPIResponse} from './FuseAPIResponse';
import { Platform } from "./Platform";
import { ContentType } from "./ContentType";

export type TAPIBridgeFunction = (type?: ContentType, data?: TFuseAPIArgs) => Promise<FuseAPIResponse>;

/**
 * Base class for Fuse Plugins
 */
export abstract class FusePlugin<TAPIOpts = unknown> {
    private $context: FuseContext;
    private $apiFactory: AbstractFuseAPIFactory;

    public constructor(context: FuseContext) {
        this.$context = context;
        this.$apiFactory = this._createAPIFactory() || context.getDefaultAPIFactory();
    }

    /**
     * Creates the API bridge
     * @param platform 
     * @returns 
     */
    protected _createAPI(platform: Platform): FuseAPI {
        return this._getAPIFactory().create(platform);
    }

    protected _createAPIFactory(): AbstractFuseAPIFactory {
        return null;
    }

    protected _getAPIFactory(): AbstractFuseAPIFactory {
        return this.$apiFactory;
    }

    /**
     * TAPIOpts is a plugin generic type declaring options.
     * User may use this to declare a path on how to get a particular FuseAPI.
     * 
     * This API may be overridden by subclasses to utilise the given options.
     * The default implementation is to simply return a standard FuseAPI.
     * 
     * @param opts 
     * @returns 
     */
    protected _getAPI(opts?: TAPIOpts): FuseAPI {
        return this.$getAPI();
    }

    /**
     * Returns a standard FuseAPI
     * @returns 
     */
    private $getAPI(): FuseAPI {
        return this._getAPIFactory().create(this.getContext().getPlatform());
    }

    /**
     * Creates a callback context that can be passed to native
     * The native code can use the callbackID to callback to the JS code.
     * 
     * The callback can be used several times.
     * 
     * Release the callback using _releaseCallback with the given callbackID.
     * These API usages should be part of your plugin API. When releasing a callback,
     * a standard API call should be made to your plugin to tell the native side that
     * the callback is no longer usable, and it should clean up the native resources surrounding
     * the callback context.
     * 
     * Note that callback data payloads only supports strings.
     * 
     * @param cb 
     * @returns String - callbackID
     */
    protected _createCallback(cb: TFuseAPICallbackHandler, apiOpts?: TAPIOpts): string {
        return this._getAPI(apiOpts).createCallbackContext(cb);
    }

    /**
     * Releases a created callback.
     * 
     * @param id callbackID
     */
    protected _releaseCallback(id: string, apiOpts?: TAPIOpts): void {
        this._getAPI(apiOpts).releaseCallback(id);
    }

    /**
     * Returns the FuseContext
     * 
     * @returns 
     */
    public getContext(): FuseContext {
        return this.$context;
    }

    /**
     * 
     * Concrete classes should implement and return a string that uniquely represents this plugin.
     * The string must conform to URL fragment rules. It shall only contain the following characters:
     *  - Alphabetical letters
     *  - Numbers
     *  - dots and hyphens
     * 
     * @abstract
     */
    protected abstract _getID(): string;

    /**
     * Returns the plugin ID
     */
    public getID(): string {
        return this._getID();
    }

    /**
     * The execution API. Concrete classes can call this to perform calls to the native side.
     * 
     * The concrete class should expose public methods with type information exposed.
     * 
     * @param method The method link, this should match the endpoint defined in the native API.
     * @param contentType the MIME type of the data you are passing in.
     * @param data - The data to pass to the native environment
     * @returns {ArrayBuffer} The response body from native. FuseResponseReader has some utility methods to read the data in common formats (e.g. text or JSON)
     */
    protected async _exec(method: string, contentType?: string, data?: TFuseAPIArgs, apiOpts?: TAPIOpts): Promise<FuseAPIResponse> {
        return await this._getAPI(apiOpts).execute(this.getID(), method, contentType, data);
    }

    protected _createAPIBridge(route: string): TAPIBridgeFunction {
        return async (type?: ContentType, data?: TFuseAPIArgs): Promise<FuseAPIResponse> => {
            return await this._exec(route, type, data);
        };
    }
}

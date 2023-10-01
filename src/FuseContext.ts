
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

import { AbstractFuseAPIFactory } from './AbstractFuseAPIFactory';
import { FuseAPIFactory } from './FuseAPIFactory';
import { Platform } from "./Platform";
import { PlatformResolver } from "./PlatformResolver";
import {
    FuseRuntime,
    IRuntimeInfo,
    TPauseCallbackHandler,
    TResumeCallbackHandler
} from './plugins/FuseRuntime';
import {Version} from './Version';

/**
 * A context class that holds Fuse Framework state
 */
export class FuseContext {
    private $platform: Platform;
    private $runtime: FuseRuntime;
    private $runtimeVersion: Version;
    private $defaultAPIFactory: AbstractFuseAPIFactory;

    public constructor() {
        let presolver: PlatformResolver = this._createPlatformResolver();
        this.$platform = presolver.resolve();
        this.$runtimeVersion = null;
        this.$defaultAPIFactory = this._createFuseAPIFactory();
        this.$runtime = new FuseRuntime(this);
    }

    public getDefaultAPIFactory(): AbstractFuseAPIFactory {
        return this.$defaultAPIFactory;
    }

    protected _createFuseAPIFactory(): AbstractFuseAPIFactory {
        return new FuseAPIFactory();
    }

    protected _createPlatformResolver(): PlatformResolver {
        return new PlatformResolver();
    }

    public getPlatform(): Platform {
        return this.$platform;
    }

    public async getPlatformVersion(): Promise<Version> {
        if (!this.$runtimeVersion) {
            let info: IRuntimeInfo = await this.$runtime.getInfo();
            this.$runtimeVersion = Version.parseVersionString(info.version);
        }
        
        return this.$runtimeVersion;
    }

    public async registerPauseHandler(callback: TPauseCallbackHandler): Promise<string> {
        return await this.$runtime.registerPauseHandler(callback);
    }

    public async unregisterPauseHandler(callbackID: string): Promise<void> {
        return await this.$runtime.unregisterPauseHandler(callbackID);
    }

    public async registerResumeHandler(callback: TResumeCallbackHandler): Promise<string> {
        return await this.$runtime.registerResumeHandler(callback);
    }

    public async unregisterResumeHandler(callbackID: string): Promise<void> {
        return await this.$runtime.unregisterResumeHandler(callbackID);
    }
}

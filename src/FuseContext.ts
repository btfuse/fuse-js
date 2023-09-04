
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
// import { FuseContentAPIFactory } from './FuseContentAPIFactory';
import { Platform } from "./Platform";
import { PlatformResolver } from "./PlatformResolver";
import {FuseRuntime, IRuntimeInfo} from './plugins/FuseRuntime';
import {Version} from './Version';

/**
 * A context class that holds Fuse Framework state
 */
export class FuseContext {
    private $platform: Platform;
    private $runtime: FuseRuntime;
    private $runtimeVersion: Version;
    private $fuseAPIFactory: AbstractFuseAPIFactory;

    public constructor() {
        let presolver: PlatformResolver = this._createPlatformResolver();
        this.$platform = presolver.resolve();
        this.$runtimeVersion = null;
        this.$fuseAPIFactory = this._createFuseAPIFactory();
        this.$runtime = new FuseRuntime(this);
    }

    public getAPIFactory(): AbstractFuseAPIFactory {
        return this.$fuseAPIFactory;
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
}

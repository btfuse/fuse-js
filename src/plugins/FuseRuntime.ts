
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

import { ContentType } from '../ContentType';
import { FuseContext } from '../FuseContext';
import {FusePlugin} from '../FusePlugin';
import {FuseResponseReader} from '../FuseResponseReader';

export interface IRuntimeInfo {
    version: string;
}

export class FuseRuntime extends FusePlugin {
    private $callbackIDs: string[];

    public constructor(context: FuseContext) {
        super(context);
        this.$callbackIDs = [];
    }

    protected override _getID(): string {
        return 'FuseRuntime';
    }
    
    public async getInfo(): Promise<IRuntimeInfo> {
        let data: ArrayBuffer = await this._exec('info');
        return await FuseResponseReader.readAsJSON(data);
    }

    public async registerPauseListener(cb: () => void): Promise<string> {
        let cbID: string = this._createCallback((payload: string) => {
            cb();
        });

        await this._exec('registerPauseListener', ContentType.TEXT, cbID);
        this.$callbackIDs.push(cbID);

        return cbID;
    }

    public async unregisterPauseListener(callbackID: string): Promise<void> {
        await this._exec('unregisterPauseListener', ContentType.TEXT, callbackID);
    }

    public async registerResumeListener(cb: () => void): Promise<string> {
        let cbID: string = this._createCallback((payload: string) => {
            cb();
        });

        await this._exec('registerResumeListener', ContentType.TEXT, cbID);
        this.$callbackIDs.push(cbID);

        return cbID;
    }

    public async unregisterResumeListener(callbackID: string): Promise<void> {
        await this._exec('unregisterResumeListener', ContentType.TEXT, callbackID);
    }
}

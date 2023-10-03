
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

import { ContentType } from "../ContentType";
import { FuseContext } from "../FuseContext";
import { FusePlugin } from "../FusePlugin";

interface ILogPacket {
    level: string;
    message: string;
}

export class FuseLoggerPlugin extends FusePlugin {
    private $callbackIDs: string[];

    public constructor(context: FuseContext) {
        super(context);
        this.$callbackIDs = [];

        // TODO: setup log listener
    }

    protected override _getID(): string {
        return 'FuseLogger';
    }

    public async log(level: string, message: string): Promise<void> {
        // perhaps this should use not a plugin, but rather the tradtional API
        await this._exec('/log', ContentType.TEXT, level + '\t' + message);
    }
}

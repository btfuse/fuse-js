import { ISerializable } from "./ISerializable";
import { TSerializable } from "./TSerializable";

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
export class FuseSerializer {
    public constructor() {}

    protected _serializeToString(obj: TSerializable): string {
        if (typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'string') {
            return this._serializePrimitiveToString(obj);
        }
        else if (obj instanceof Date) {
            return this._serializeDateToString(obj);
        }
        else if (this._isISerializable(obj)) {
            return this._serializeToString(obj.serialize());
        }

        // When all else fails, attempt to JSON stringify
        return JSON.stringify(obj);
    }

    protected _serializePrimitiveToString(obj: number | string | boolean): string {
        return obj.toString();
    }

    protected _serializeDateToString(obj: Date): string {
        return obj.toISOString();
    }

    public serialize(obj: TSerializable): Blob {
        if (obj === null || obj === undefined) {
            return null;
        }

        let bin: Blob;
        if (obj instanceof Blob) {
            bin = obj;
        }
        else if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || obj instanceof Date) {
            bin = new Blob([this._serializeToString(obj)]);
        }
        else if (obj instanceof ArrayBuffer) {
            bin = new Blob([obj]);
        }
        else if (this._isISerializable(obj)) {
            bin = new Blob([this.serialize(obj.serialize())]);
        }
        else {
            // should be either JSON objects or json arrays at this point
            bin = new Blob([this._serializeToString(obj)]);
        }

        return bin;
    }

    protected _isISerializable(x: any): x is ISerializable {
        return !!x.serialize && typeof x.serialize === 'function';
    }
}

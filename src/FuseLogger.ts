
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

import {
    IFuseLogger
} from './IFuseLogger';
import {TSerializable} from './TSerializable';
import {ISerializable} from './ISerializable';
import { FuseLoggerLevel } from './FuseLoggerLevel';

export class FuseLoggerSerializer {
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
        else if (obj instanceof Error) {
            return this._serializeErrorToString(obj);
        }

        // When all else fails, attempt to JSON stringify
        return JSON.stringify(obj, null, 4);
    }

    protected _serializePrimitiveToString(obj: number | string | boolean): string {
        return obj.toString();
    }

    protected _serializeErrorToString(obj: Error): string {
        let serializedError = {
            name: obj.name,
            message: obj.message,
            stack: obj.stack
        };

        return JSON.stringify(serializedError, null, 4);
    }

    protected _serializeDateToString(obj: Date): string {
        return obj.toISOString();
    }

    public serialize(obj: TSerializable): string {
        if (obj === null || obj === undefined) {
            return null;
        }

        let out: string = null;
        if (obj instanceof Blob) {
            out = `[Blob ${obj.type || 'Binary'} (${obj.size} bytes)]`;
        }
        else if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || obj instanceof Date) {
            out = this._serializeToString(obj);
        }
        else if (obj instanceof ArrayBuffer) {
            out = `[ArrayBuffer (${obj.byteLength} bytes)]`;
        }
        else if (this._isISerializable(obj)) {
            out = this.serialize(obj.serialize());
        }
        else {
            // should be either JSON objects or json arrays at this point
            out = this._serializeToString(obj);
        }

        return out;
    }

    protected _isISerializable(x: any): x is ISerializable {
        return !!x.serialize && typeof x.serialize === 'function';
    }
}

/**
 * A base logger implementation which includes a serializer for common types.
 * It will serialize/accept all values that TSerializable accepts, however Blob/ArrayBuffer
 * or other binary data types will not be serialized. Instead it will print an
 * object identifier, with mime type if present, along with the size of the buffer.
 * 
 * The base logger does not provide any native bridging. While usable for purely webview side,
 * use the FuseLoggerFactory to get a logger specific for your runtime environment.
 */
export class FuseLogger implements IFuseLogger {
    private $level: FuseLoggerLevel;
    private $enableNativeBridge: boolean;
    private $serializer: FuseLoggerSerializer;

    public constructor() {
        this.$enableNativeBridge = true;
        this.$level = FuseLoggerLevel.INFO | FuseLoggerLevel.WARN | FuseLoggerLevel.ERROR;
        this.$serializer = new FuseLoggerSerializer();
    }

    public setLevel(level: FuseLoggerLevel): void {
        this.$level = level;
    }

    public getLevel(): FuseLoggerLevel {
        return this.$level;
    }

    public enableNativeBridge(flag: boolean): void {
        this.$enableNativeBridge = !!flag;
    }

    /**
     * @param level The log level for this log print
     * @param message Overridable hook to send logs to the native environment
     */
    protected _logToNative(level: FuseLoggerLevel, message: string): void {}

    private $logToNative(level: FuseLoggerLevel, args: TSerializable[]): void {
        if (!this.$enableNativeBridge) {
            return;
        }

        let serializedArgs: string[] = [];

        for (let i: number = 0; i < args.length; i++) {
            serializedArgs.push(this.$serializer.serialize(args[i]));
        }

        this._logToNative(level, serializedArgs.join('\t'));
    }

    public debug(...args: TSerializable[]): void {
        if (!(this.$level & FuseLoggerLevel.DEBUG)) {
            return;
        }

        console.log(...args);
        this.$logToNative(FuseLoggerLevel.DEBUG, args);
    }

    public info(...args: TSerializable[]): void {
        if (!(this.$level & FuseLoggerLevel.INFO)) {
            return;
        }

        console.info(...args);
        this.$logToNative(FuseLoggerLevel.INFO, args);
    }

    public warn(...args: TSerializable[]): void {
        if (!(this.$level & FuseLoggerLevel.WARN)) {
            return;
        }

        console.warn(...args);
        this.$logToNative(FuseLoggerLevel.WARN, args);
    }

    public error(...args: TSerializable[]): void {
        if (!(this.$level & FuseLoggerLevel.ERROR)) {
            return;
        }

        console.error(...args);
        this.$logToNative(FuseLoggerLevel.ERROR, args);
    }
}


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

export type TFuseErrorCause = string | Error | FuseError | null;

export interface IFuseErrorSerialized {
    domain: string;
    message: string;
    code: number;
}

export class FuseError extends Error {
    private $domain: string;
    private $message: string;
    private $cause: TFuseErrorCause;
    private $code: number;

    public constructor(domain: string, message: string, cause?: TFuseErrorCause, code?: number) {
        super(message);
        this.name = this.constructor.name;
        this.$domain = domain;
        this.$message = message;
        this.$code = code || 0;
        this.$cause = cause || null;
    }

    public getMessage(): string {
        return this.$message;
    }

    public getDomain(): string {
        return this.$domain;
    }

    public getCode(): number {
        return this.$code;
    }

    public getCause(): TFuseErrorCause | null {
        return this.$cause;
    }

    public static wrap(error: string | Error | FuseError | IFuseErrorSerialized | unknown): FuseError {
        let ferr: FuseError = null;
        if (typeof error === 'string') {
            ferr = new FuseError('Unknown', error, null, 0);
        }
        else if (error instanceof FuseError) {
            ferr = error;
        }
        else if (error instanceof Error) {
            ferr = new FuseError(error.name, error.message, error, 0);
        }
        else if (FuseError.$isSerializedFuseError(error)) {
            ferr = FuseError.fromSerialized(error);
        }
        else {
            console.error('Unwrappable Error', error);
            ferr = new FuseError('FuseError', 'Unwrappable error', null, 0);
        }

        return ferr;
    }

    public static fromSerialized(error: IFuseErrorSerialized): FuseError {
        return new FuseError(error.domain, error.message, null, error.code);
    }

    public toString() {
        return 'FuseError';
    }

    private static $isSerializedFuseError(error: any): error is IFuseErrorSerialized {
        return 'message' in error && 'domain' in error && 'code' in error;
    }
}

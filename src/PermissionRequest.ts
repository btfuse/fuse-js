
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

import { ContentType } from './ContentType';
import { FuseAPIResponse } from './FuseAPIResponse';
import { FuseError } from './FuseError';
import {TAPIBridgeFunction} from './FusePlugin';
import {IPermissionRequest} from './IPermissionRequest';
import {PermissionStatus} from './PermissionStatus';
import { TSerializable, TFuseSerializable } from './TSerializable';

/**
 * Invoked to handle when permission justification is necessary.
 * 
 * This is an android concept, so it will only be invoked on Android devices,
 * as iOS has justification text embedded into the actual permission prompt.
 * 
 * User dialog should be displayed to explain why the app wants to use the permission.
 * Android recommends giving the user the ability to accept or deny at this time, if the user deny,
 * then resolve the promise will false.
 * 
 * Return true if the permission request should proceed.
 */
export type TJustificationHandler = () => Promise<boolean>;

interface __IPermissionRequestArguments<T extends TSerializable> {
    permissionSet: T[];
    isJustified: boolean;
}

export type TPermissionRequestArguments<T extends TSerializable> = TFuseSerializable<__IPermissionRequestArguments<T>>;

export type TAPIPermissionRequest<T extends TSerializable> = TAPIBridgeFunction<ContentType.JSON, TPermissionRequestArguments<T>>;


/**
 * Abstract class to handle permission request.
 * Concrete classes should implement the protected _request method to call on their
 * permission request Fuse API.
 */
export class PermissionRequest<TSupportedPermission = unknown> implements IPermissionRequest<TSupportedPermission> {
    private static readonly TAG: string = 'PermissionRequest';

    private $api: TAPIBridgeFunction;
    private $permissionSet: TSupportedPermission[];
    private $justificationHandler: TJustificationHandler | null;

    public constructor(apiBridge: TAPIBridgeFunction, permissionSet: TSupportedPermission[], justificationHandler: TJustificationHandler = null) {
        if (!permissionSet || (permissionSet && permissionSet.length === 0)) {
            throw new FuseError(PermissionRequest.TAG, 'At least one permission is required');
        }

        this.$api = apiBridge;
        this.$permissionSet = permissionSet;
        this.$justificationHandler = justificationHandler;
    }

    public getPermissionSet(): TSupportedPermission[] {
        return this.$permissionSet;
    }

    private $createRejectionError(): FuseError {
        return new FuseError(PermissionRequest.TAG, 'Permission Denied');
    }

    private async $request(): Promise<PermissionStatus> {
        let response: FuseAPIResponse = await this.$api(ContentType.JSON, JSON.stringify(this.getPermissionSet()));
        if (response.isError()) {
            throw await response.readAsError();
        }

        let code: PermissionStatus = parseInt(await response.readAsText());
        if (code < PermissionStatus.GRANTED || code > PermissionStatus.DENIED) {
            throw new FuseError(PermissionRequest.TAG, 'request response is an invalid PermissionStatus value');
        }

        return code;
    }

    private async $onJustificationRequest(): Promise<boolean> {
        if (!this.$justificationHandler) {
            console.warn('Permission requires justification, but this request has no TJustificationHandler');
            return false;
        }

        return await this.$justificationHandler();
    }
    
    public async request(): Promise<void> {
        let status: PermissionStatus = await this.$request();

        if (status === PermissionStatus.GRANTED) {
            return; //success
        }

        if (status === PermissionStatus.DENIED) {
            throw this.$createRejectionError();
        }

        if (status === PermissionStatus.REQUIRES_JUSTIFICATION) {
            if (await this.$onJustificationRequest()) {
                status = await this.$request();
            }
            else {
                throw this.$createRejectionError();
            }

            if (status === PermissionStatus.GRANTED) {
                return; //success
            }
            else {
                throw this.$createRejectionError();
            }
        }

        // We should never actually reach here
        throw new FuseError(PermissionRequest.TAG, 'Internal Error');
    }
}

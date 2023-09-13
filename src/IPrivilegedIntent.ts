
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

/**
 * An interface to standardize handling permissions
 * @experimental
 */
export interface IPrivilegedIntent {
    /**
     * A list of symbols that would represent the permission to request on the native side.
     */
    getPermissionSet(): string[];

    /**
     * Invoked when justification is required.
     * This is an opportunity to show UX explaining your need permissions.
     * 
     * This is an Android concept, so this will only be invoked on Android devices.
     * iOS justification text appears in the permission prompt itself, and is defined via the plist.
     */
    onJustificationRequest(): Promise<boolean>;

    /**
     * Request the permission set
     * Will resolve if all permissions in the set is granted.
     * Rejects otherwise.
     */
    request(): Promise<void>;
}

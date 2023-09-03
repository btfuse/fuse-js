
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

export class Version {
    private $major: number;
    private $minor: number;
    private $patch?: number;

    public static readonly LESS_THAN: number = -1;
    public static readonly EQUAL: number = 0;
    public static readonly GREATER_THAN: number = 1;

    public constructor(major: number, minor?: number, patch?: number) {
        this.$major = major;
        this.$minor = minor || 0;
        this.$patch = patch || 0;
    }

    public static parseVersionString(version: string): Version {
        let parts: string[] = version.split('.');

        let major: number = parseInt(parts[0]);
        let minor: number = parseInt(parts[1]);
        let patch: number = parseInt(parts[2]);

        if (isNaN(major)) {
            major = 0;
        }

        if (isNaN(minor)) {
            minor = 0;
        }

        if (isNaN(patch)) {
            patch = 0;
        }

        return new Version(major, minor, patch);
    }

    public getMajor(): number {
        return this.$major;
    }

    public getMinor(): number {
        return this.$minor;
    }

    public getPatch(): number {
        return this.$patch;
    }

    public toString(): string {
        return `${this.$major}.${this.$minor}.${this.$patch}`;
    }

    
    public compare(b: Version): number {
        return Version.compare(this, b);
    }

    public static compare(lhs: Version, rhs: Version): number {
        if (lhs.$major === rhs.$major && lhs.$minor === rhs.$minor && lhs.$patch === rhs.$patch) {
            return Version.EQUAL;
        }

        if (lhs.$major === rhs.$major) {
            if (lhs.$minor === rhs.$minor) {
                if (lhs.$patch === rhs.$patch) {
                    // shouldn't have reached here... as it should have been caught by the simple test above first
                    // but for consistency we will keep it here.
                    return Version.EQUAL
                }
                else {
                    return lhs.$patch > rhs.$patch ? Version.GREATER_THAN : Version.LESS_THAN;
                }
            }
            else {
                return lhs.$minor > rhs.$minor ? Version.GREATER_THAN : Version.LESS_THAN;
            }
        }
        else {
            return lhs.$major > rhs.$major ? Version.GREATER_THAN : Version.LESS_THAN;
        }
    }
}

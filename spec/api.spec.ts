
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

import * as api from '../src/api';
import {AbstractFuseAPIFactory} from '../src/AbstractFuseAPIFactory';
import {FuseAPI} from '../src/FuseAPI';
import {FuseContext} from '../src/FuseContext';
import {FusePlugin} from '../src/FusePlugin';
import {FuseResponseReader} from '../src/FuseResponseReader';
import {FuseAPIFactory} from '../src/FuseAPIFactory';
import {HTTPFuseAPI} from '../src/HTTPFuseAPI';
import {Platform} from '../src/Platform';
import {PlatformResolver} from '../src/PlatformResolver';
import {Version} from '../src/Version';
import {ContentType} from '../src/ContentType';
import {FuseError} from '../src/FuseError';
import {FuseAPIResponse} from '../src/FuseAPIResponse';

describe('Public API', () => {
    it('AbstractFuseAPIFactory', () => {
        expect(api.AbstractFuseAPIFactory).toBe(AbstractFuseAPIFactory);
    });

    it('FuseError', () => {
        expect(api.FuseError).toBe(FuseError);
    });

    it('FuseAPIResponse', () => {
        expect(api.FuseAPIResponse).toBe(FuseAPIResponse);
    });

    it('ContentType', () => {
        expect(api.ContentType).toBe(ContentType);
    });

    it('FuseAPI', () => {
        expect(api.FuseAPI).toBe(FuseAPI);
    });

    it('FuseContext', () => {
        expect(api.FuseContext).toBe(FuseContext);
    });

    it('FusePlugin', () => {
        expect(api.FusePlugin).toBe(FusePlugin);
    });

    it('FuseResponseReader', () => {
        expect(api.FuseResponseReader).toBe(FuseResponseReader);
    });

    it('FuseAPIFactory', () => {
        expect(api.FuseAPIFactory).toBe(FuseAPIFactory);
    });

    it('HTTPFuseAPI', () => {
        expect(api.HTTPFuseAPI).toBe(HTTPFuseAPI);
    });

    it('Platform', () => {
        expect(api.Platform).toBe(Platform);
    });

    it('PlatformResolver', () => {
        expect(api.PlatformResolver).toBe(PlatformResolver);
    });

    it('Version', () => {
        expect(api.Version).toBe(Version);
    });
});

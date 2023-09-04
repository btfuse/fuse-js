
import {FusePlugin} from '../FusePlugin';

export interface IRuntimeInfo {
    version: string;
}

export class FuseRuntime extends FusePlugin {
    protected override _getID(): string {
        return 'FuseRuntime';
    }
    
    public async getInfo(): Promise<IRuntimeInfo> {
        // TODO: Perhaps make some convenience reader methods
        let data: ArrayBuffer = await this._exec('info');
        return JSON.parse(await new Blob([data]).text());
    }
}

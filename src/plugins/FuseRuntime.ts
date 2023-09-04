
import {FusePlugin} from '../FusePlugin';
import {FuseResponseReader} from '../FuseResponseReader';

export interface IRuntimeInfo {
    version: string;
}

export class FuseRuntime extends FusePlugin {
    protected override _getID(): string {
        return 'FuseRuntime';
    }
    
    public async getInfo(): Promise<IRuntimeInfo> {
        let data: ArrayBuffer = await this._exec('info');
        return await FuseResponseReader.readAsJSON(data);
    }
}

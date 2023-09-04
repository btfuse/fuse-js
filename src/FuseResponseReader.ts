
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
 * A static class with convenience methods for reading common
 * response content body formats.
 */
export class FuseResponseReader {
    private constructor() {}

    public static async readAsText(data: ArrayBuffer): Promise<string> {
        return await new Promise<string>((resolve, reject) => {
            let reader: FileReader = new FileReader();
            reader.onload = () => {
                resolve(<string>reader.result);
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsText(new Blob([data]));
        });
    }

    public static async readAsJSON<T>(data: ArrayBuffer): Promise<T> {
        let str: string = await this.readAsText(data);
        return JSON.parse(str);
    }
}
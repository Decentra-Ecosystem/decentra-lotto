import { Injectable } from '@angular/core';

interface Scripts {
    name: string;
    src: string;
    id: string;
    generatedElements: Array<string>;
}

export const ScriptStore: Scripts[] = [
    { name: 'rubic', src: 'https://widgets.rubic.exchange/iframe/bundle.min.js', id:"rubic", generatedElements:[] }
];

declare var document: any;

@Injectable({ providedIn: 'root' })
export class DynamicScriptLoaderService {

    private scripts: any = {};

    constructor() {
        ScriptStore.forEach((script: any) => {
            this.scripts[script.name] = {
                loaded: false,
                src: script.src,
                id: script.id,
                generatedElements: script.generatedElements
            };
        });
    }

    load(...scripts: string[]) {
        const promises: any[] = [];
        scripts.forEach((script) => promises.push(this.loadScript(script)));
        return Promise.all(promises);
    }

    loadScript(name: string, widgetId:string = null) {
        return new Promise((resolve) => {
            if (!this.scripts[name].loaded) {
                // load script
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = this.scripts[name].src;
                if (widgetId != null){
                    script.setAttribute("data-widget", widgetId);
                    script.setAttribute("id", this.scripts[name].id);
                }
                if (script.readyState) {  // IE
                    script.onreadystatechange = () => {
                        if (script.readyState === 'loaded' || script.readyState === 'complete') {
                            script.onreadystatechange = null;
                            this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        }
                    };
                } else {  // Others
                    script.onload = () => {
                        this.scripts[name].loaded = true;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                }
                script.onerror = () => resolve({ script: name, loaded: false, status: 'Loaded' });
                document.getElementsByTagName('head')[0].appendChild(script);
            } else {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            }
        });
    }

    unloadScript(name: string) {
        return new Promise((resolve) => {
            if (this.scripts[name].loaded){
                document.getElementsByTagName('head')[0].removeChild(document.getElementById(this.scripts[name].id))
                this.scripts[name].generatedElements.forEach(element => {
                    var x = document.getElementById(element);
                    x.parentNode.removeChild(x);
                });
                this.scripts[name].loaded = false;
                resolve({ script: name, loaded: false, status: 'Script Unloaded' });
            }else{
                resolve({ script: name, loaded: false, status: 'Script not found' });
            }
        });
    }

}
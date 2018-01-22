import * as debug from 'debug';
import * as pjson from 'pjson';
import * as tv4 from 'tv4';

import { IJSONObject } from './interfaces';

export class Debugger {
    /* tslint:disable-next-line:no-any */
    private dbug: any;
    constructor(namespace: string) {
        this.dbug = debug(`${pjson.name}:${namespace}`);
    }
    public print(message: string): void {
        let trimmed: string = '';
        message.split(/\n/).forEach((line) => {
            if (line) {
                trimmed += line.trim() + '\n';
            }
        });
        this.dbug(trimmed);
    }
}

const dbug: Debugger = new Debugger('helpers');

export function validateJSONSchema(payload: IJSONObject, schema: IJSONObject): void {
    const valid: boolean = tv4.validate(payload, schema);
    if (!valid) {
        dbug.print(`
            -------------------------------------------
            INVALID JSON
            -------------------------------------------
            ${schema.id}
            ${tv4.error.message} at ${tv4.error.schemaPath}. ${JSON.stringify(payload, null, 2)}
            -------------------------------------------
        `);
        throw new Error(`
            The JSON object did not validate with ${schema.id}. ${tv4.error.message} at ${tv4.error.schemaPath}
        `);
    }
}

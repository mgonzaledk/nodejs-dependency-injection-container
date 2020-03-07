import 'reflect-metadata';

import { CONTAINS_INJECTIONS_METADATA_KEY } from './Constants';
import { Type } from './Type';

export function ContainsInjections() {
    return (target: any) => {
        Reflect.defineMetadata(CONTAINS_INJECTIONS_METADATA_KEY,
            true, target);
        return target;
    }
}

export function IsInjectable<T>(target: Type<T>) {
    return Reflect.getMetadata(CONTAINS_INJECTIONS_METADATA_KEY, target) === true;
}

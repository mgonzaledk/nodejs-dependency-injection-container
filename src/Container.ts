import 'reflect-metadata';
import {Provider, Token} from './Provider'

export class Container {
    AddProvider<T>(provider: Provider<T>) {

    }

    Inject<T>(type: Token<T>): T {
        return {} as T;
    }
}

import { Type } from './Type';

export class InjectionToken {
    constructor(public injectionIdentifier: string) {

    }
}

export type Factory<T> = () => T;

export type Token<T> = Type<T> | InjectionToken;

export interface BaseProvider<T> {
    provide: Token<T>;
}

export interface ClassProvider<T> extends BaseProvider<T> {
    useClass: Type<T>;
}

export interface FactoryProvider<T> extends BaseProvider<T> {
    useFactory: Factory<T>;
}

export interface ValueProvider<T> extends BaseProvider<T> {
    useValue: T;
}

export type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>;

export function IsClassProvider<T>(
    provider: BaseProvider<T>
): provider is ClassProvider<T> {
    return (provider as any).useClass !== undefined;
}

export function IsFactoryProvider<T>(
    provider: BaseProvider<T>
): provider is FactoryProvider<T> {
    return (provider as any).useFactory !== undefined;
}

export function IsValueProvider<T>(
    provider: BaseProvider<T>
): provider is ValueProvider<T> {
    return (provider as any).useValue !== undefined;
}

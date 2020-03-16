import 'reflect-metadata';

import {REFLECT_PARAMS} from './Constants';
import {IsInjectable} from './ContainsInjections';
import {
    ClassProvider,
    FactoryProvider,
    InjectionToken,
    IsClassProvider,
    IsFactoryProvider,
    Provider,
    Token,
    ValueProvider
} from './Provider';
import {Type} from './Type';
import {GetInjectionToken} from './Inject';

type InjectableParam = Type<any>;

export class Container {
    private providers = new Map<Token<any>, Provider<any>>();

    AddProvider<T>(provider: Provider<T>) {
        this.AssertContainsInjection(provider);
        this.providers.set(provider.provide, provider);
    }

    Inject<T>(type: Token<T>): T {
        let provider = this.providers.get(type);

        if(provider === undefined && !(type instanceof InjectionToken)) {
            provider = {
                provide: type,
                useClass: type
            };

            this.AssertContainsInjection(provider);
        }

        return this.InjectWithProvider(type, provider);
    }

    private GetTokenName<T>(token: Token<T>) {
        return token instanceof InjectionToken ?
            token.injectionIdentifier :
            token.name;
    }

    private GetInjectedParams<T>(target: Type<T>) {
        const argTypes = Reflect.getMetadata(REFLECT_PARAMS, target) as (
            | InjectableParam
            | undefined
        )[];

        if(argTypes === undefined) {
            return [];
        }

        return argTypes.map((argType, index) => {
            if(argType === undefined) {
                throw new Error(
                    `Injection error. Recursive dependency detected in constructor for type ${
                        target.name
                    } with parameter at index ${index}`
                );
            }

            const overrideToken = GetInjectionToken(target, index);
            const actualToken = overrideToken === undefined ? argType : overrideToken;
            let provider = this.providers.get(actualToken);

            return this.InjectWithProvider(actualToken, provider);
        })
    }

    private AssertContainsInjection<T>(provider: Provider<T>) {
        if(IsClassProvider(provider) && !IsInjectable(provider.useClass)) {
            throw new Error(
                `Can not provide ${this.GetTokenName(
                    provider.provide
                )} using class ${this.GetTokenName(
                    provider.useClass
                )}, ${this.GetTokenName(provider.useClass)} is not injectable`
            );
        }
    }

    private InjectClass<T>(provider: ClassProvider<T>): T {
        const target = provider.useClass;
        const params = this.GetInjectedParams(target);

        return Reflect.construct(target, params);
    }

    private InjectFactory<T>(provider: FactoryProvider<T>): T {
        return provider.useFactory();
    }

    private InjectValue<T>(provider: ValueProvider<T>): T {
        return provider.useValue;
    }

    private InjectWithProvider<T>(type: Token<T>, provider?: Provider<T>): T {
        if(provider === undefined) {
            throw new Error(`No provider for type ${this.GetTokenName(type)}`);
        }

        if(IsClassProvider(provider)) {
            return this.InjectClass(provider as ClassProvider<T>);
        } else if(IsFactoryProvider(provider)) {
            return this.InjectFactory(provider as FactoryProvider<T>);
        }

        return this.InjectValue(provider as ValueProvider<T>);
    }
}

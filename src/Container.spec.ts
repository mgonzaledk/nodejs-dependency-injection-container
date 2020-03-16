import { Container } from './Container';
import { ContainsInjections } from './ContainsInjections';
import { Inject } from './Inject';
import { InjectionToken } from './Provider';

describe('Container', () => {
    describe('Inject', () => {
        class BasicClass {
            constructor(public x: number) {}
        }

        @ContainsInjections()
        class InjectableClass {
            constructor(public basicClass: BasicClass) {}
        }

        @ContainsInjections()
        class ACircularClass {
            constructor(public other: BCircularClass) {}
        }

        @ContainsInjections()
        class BCircularClass {
            constructor(public other: ACircularClass) {}
        }

        @ContainsInjections()
        class AnotherBasicClass {
        }

        @ContainsInjections()
        class TokenOverrideClass {
            constructor(@Inject(AnotherBasicClass) public basicClass: BasicClass) {}
        }

        const SPECIAL_STRING_TOKEN = new InjectionToken('some-identifier');
        @ContainsInjections()
        class TokenStringOverrideClass {
            constructor(@Inject(SPECIAL_STRING_TOKEN) public someValue: string) {}
        }

        interface SomeInterface {
            a: string;
        }

        @ContainsInjections()
        class SomeInterfaceClass {
            constructor(public someInterface: SomeInterface) {}
        }

        it('can inject using a value provider', () => {
            const container = new Container();
            const input = { x: 200 };
            container.AddProvider({ provide: BasicClass, useValue: input });
            const output = container.Inject(BasicClass);

            expect(input).toBe(output);
        });

        it('can inject using a factory provider', () => {
            const container = new Container();
            const input = { x: 200 };

            container.AddProvider({ provide: BasicClass, useFactory: () => input });
            const injectedVal = container.Inject(BasicClass);

            expect(injectedVal).toBe(input);
        });

        it('can inject using a class provider', () => {
            const container = new Container();
            const basicValue = { x: 200 };

            container.AddProvider({ provide: BasicClass, useValue: basicValue });
            container.AddProvider({
                provide: InjectableClass,
                useClass: InjectableClass
            });

            const injectedVal = container.Inject(InjectableClass);

            expect(injectedVal.basicClass).toBe(basicValue);
        });

        it('will default to a class provider for the top level class if no provider for that type exists and the type is injectable', () => {
            const container = new Container();
            const basicValue = { x: 200 };

            container.AddProvider({ provide: BasicClass, useValue: basicValue });
            const injectedVal = container.Inject(InjectableClass);

            expect(injectedVal.basicClass).toBe(basicValue);
        });

        it('will throw an error when a class with a circular dependency is detected', () => {
            const container = new Container();
            container.AddProvider({
                provide: ACircularClass,
                useClass: ACircularClass
            });
            container.AddProvider({
                provide: BCircularClass,
                useClass: BCircularClass
            });

            expect(() =>
                container.Inject(ACircularClass)
            ).toThrowErrorMatchingInlineSnapshot(
                `"Injection error. Recursive dependency detected in constructor for type ACircularClass with parameter at index 0"`
            );
        });

        it('will throw an error when a class which is not injectable is provided with a class provider', () => {
            const injector = new Container();
            const provider = { provide: BasicClass, useClass: BasicClass };

            expect(() =>
                injector.AddProvider(provider)
            ).toThrowErrorMatchingInlineSnapshot(
                `"Can not provide BasicClass using class BasicClass, BasicClass is not injectable"`
            );
        });

        it('can inject a class provider with an override', () => {
            const container = new Container();

            container.AddProvider({
                provide: AnotherBasicClass,
                useClass: AnotherBasicClass
            });
            container.AddProvider({ provide: BasicClass, useValue: { x: 200 } });
            container.AddProvider({
                provide: TokenOverrideClass,
                useClass: TokenOverrideClass
            });

            const output = container.Inject(TokenOverrideClass);
            expect(output.basicClass).toEqual(new AnotherBasicClass());
        });

        it('can inject a string value provider with an override and injection token', () => {
            const container = new Container();
            const specialValue = 'the special value';

            container.AddProvider({
                provide: TokenStringOverrideClass,
                useClass: TokenStringOverrideClass
            });
            container.AddProvider({
                provide: SPECIAL_STRING_TOKEN,
                useValue: specialValue
            });

            const output = container.Inject(TokenStringOverrideClass);
            expect(output.someValue).toEqual(specialValue);
        });

        it('will throw an exception if a value for an injection token does not exist', () => {
            const container = new Container();

            container.AddProvider({
                provide: TokenStringOverrideClass,
                useClass: TokenStringOverrideClass
            });

            expect(() =>
                container.Inject(TokenStringOverrideClass)
            ).toThrowErrorMatchingInlineSnapshot(
                `"No provider for type some-identifier"`
            );
        });

        it('will fail to inject an interface', () => {
            const container = new Container();

            expect(() =>
                container.Inject(SomeInterfaceClass)
            ).toThrowErrorMatchingInlineSnapshot(`"No provider for type Object"`);
        });
    });
});

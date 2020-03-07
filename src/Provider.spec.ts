import { BaseProvider, IsClassProvider, IsFactoryProvider, IsValueProvider } from './Provider';

describe('Provider', () => {
    const objectClassProvider = {
        provide: String,
        useClass: String
    } as BaseProvider<String>;

    const objectFactoryProvider = {
        provide: String,
        useFactory: () => 'Test'
    } as BaseProvider<String>;

    const objectValueProvider = {
        provide: String,
        useValue: 'Test'
    } as BaseProvider<String>;

    describe('IsClassProvider', () => {
        it('is truthy when class provider', () => {
            const isClassProvider = IsClassProvider(objectClassProvider);
            expect(isClassProvider).toBeTruthy();
        });

        it('is falsy when any but not class provider', () => {
            const isClassProvider = IsClassProvider(objectFactoryProvider);
            expect(isClassProvider).toBeFalsy();
        })
    });

    describe('IsFactoryProvider', () => {
        it('is truthy when factory provider', () => {
            const isFactoryProvider = IsFactoryProvider(objectFactoryProvider);
            expect(isFactoryProvider).toBeTruthy();
        });

        it('is falsy when any but not factory provider', () => {
            const isFactoryProvider = IsFactoryProvider(objectClassProvider);
            expect(isFactoryProvider).toBeFalsy();
        })
    });

    describe('IsValueProvider', () => {
        it('is truthy when value provider', () => {
            const isValueProvider = IsValueProvider(objectValueProvider);
            expect(isValueProvider).toBeTruthy();
        });

        it('is falsy when any but not value provider', () => {
            const isValueProvider = IsValueProvider(objectClassProvider);
            expect(isValueProvider).toBeFalsy();
        })
    });
});

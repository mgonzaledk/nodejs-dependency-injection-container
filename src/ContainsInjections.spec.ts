import { ContainsInjections, IsInjectable } from './ContainsInjections';

describe('ContainsInjections', () => {
    @ContainsInjections()
    class TestInjectableClass {
    }

    class TestNonInjectableClass {
    }

    describe('IsInjectable', () => {
        it('is truthy when class can contains injections', () => {
            const isInjectable = IsInjectable(TestInjectableClass);
            expect(isInjectable).toBeTruthy();
        });

        it('is falsy when class can not contains injections', () => {
            const isInjectable = IsInjectable(TestNonInjectableClass);
            expect(isInjectable).toBeFalsy();
        })
    })
});

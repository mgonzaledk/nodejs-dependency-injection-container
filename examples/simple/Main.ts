import {Container, ContainsInjections, Inject, InjectionToken} from '../../src';

const TEST_TOKEN = new InjectionToken('test-token');

@ContainsInjections()
class TestService {
    private token: String;

    constructor(@Inject(TEST_TOKEN) token: String) {
        this.token = token;
    }
}

@ContainsInjections()
class MainClass {
    constructor(public testService: TestService) {}
}

const container = new Container();
container.AddProvider({ provide: TEST_TOKEN, useValue: 'TOKEN-123456'});
container.AddProvider({ provide: TestService, useClass: TestService });
container.AddProvider({provide: MainClass, useClass: MainClass });

const instance = container.Inject(MainClass);

import * as sinon from 'sinon';
import { expect } from 'chai';
import { GuardsConsumer } from './../../guards/guards-consumer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('GuardsConsumer', () => {
    let consumer: GuardsConsumer;
    let guards: any[];
    beforeEach(() => {
        consumer = new GuardsConsumer();
        guards = [{ canActivate: () => true }, { canActivate: () => true }];
    });
    describe('tryActivate', () => {
        describe('when guards array is empty', () => {
            it('should return true', async () => {
                const canActivate = await consumer.tryActivate([], {}, { constructor: null }, null);
                expect(canActivate).to.be.true;
            });
        });
        describe('when guards array is not empty', () => {
            describe('when at least on guard returns false', () => {
                it('should return false', async () => {
                    const canActivate = await consumer.tryActivate([
                        ...guards,
                        { canActivate: () => false },
                    ], {}, { constructor: null }, null);
                    expect(canActivate).to.be.false;
                });
            });
            describe('when each guard returns true', () => {
                it('should return true', async () => {
                    const canActivate = await consumer.tryActivate(guards, {}, { constructor: null }, null);
                    expect(canActivate).to.be.true;
                });
            });
        });
    });
    describe('pickResult', () => {
        describe('when result is Observable', () => {
            it('should returns promise', () => {
                expect(consumer.pickResult(Observable.of(true))).to.eventually.instanceOf(Promise);
            });
        });
        describe('when result is Promise', () => {
            it('should await promise', async () => {
                expect(await consumer.pickResult(Promise.resolve(true))).to.be.true;
            });
        });
    });
});
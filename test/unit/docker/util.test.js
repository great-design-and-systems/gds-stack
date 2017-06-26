import 'babel-polyfill';

import { createChains, getServiceActions } from '../../../src/docker/util';

import { ChainExists } from 'fluid-chains';
import { GDSDomainDTO } from '../../../src/';
import chai from 'chai';

const expect = chai.expect;
describe('Docker util', () => {
    describe('getServiceActions', () => {
        it('should return domain actions', () => {
            const domain = new GDSDomainDTO('SAMPLE_DOMAIN');
            domain.addGet('sampleGet', '/sample');
            domain.addDelete('sampleDelete', '/sample-delete');
            const domainActions = getServiceActions(domain.links);
            expect(domainActions.length).to.be.equal(2);
        })

        it('should return domain actions with different action versions', () => {
            const domain = new GDSDomainDTO('SAMPLE_DOMAIN');
            domain.addGet('sampleGet', '/sample');
            domain.addGet('sampleGet', '/sample');
            domain.addDelete('sampleDelete', '/sample-delete');
            const domainActions = getServiceActions(domain.links);
            expect(domainActions.length).to.be.equal(2);
            expect(domainActions[0]).to.haveOwnProperty('field');
            expect(domainActions[0]).to.haveOwnProperty('actions');
        })
    });
    describe('createChains', () => {
        it('should create chains based on domain actions', () => {
            const domain = new GDSDomainDTO('SAMPLE_DOMAIN');
            domain.addGet('sampleGet', '/sample');
            domain.addDelete('sampleDelete', '/sample-delete');
            const domainActions = getServiceActions(domain.links);
            createChains('SampleDomain', domainActions);
            expect(ChainExists('SampleDomain.sampleGet')).to.be.true;
            expect(ChainExists('SampleDomain.sampleDelete')).to.be.true;
        })
        it('should create chains based on domain actions with different actions versions', () => {
            const domain = new GDSDomainDTO('SAMPLE_DOMAIN');
            domain.addGet('sampleGet_2', '/sample');
            domain.addGet('sampleGet_2', '/sample');
            domain.addDelete('sampleDelete_2', '/sample-delete');
            domain.addDelete('sampleDelete_2', '/sample-delete');
            domain.addDelete('sampleDelete_2', '/sample-delete');
            const domainActions = getServiceActions(domain.links);
            createChains('SampleDomain', domainActions);
            expect(ChainExists('SampleDomain.sampleGet_2')).to.be.true;
            expect(ChainExists('SampleDomain.sampleGet_2.v2')).to.be.true;
            expect(ChainExists('SampleDomain.sampleDelete_2')).to.be.true;
            expect(ChainExists('SampleDomain.sampleDelete_2.v2')).to.be.true;
            expect(ChainExists('SampleDomain.sampleDelete_2.v3')).to.be.true;
        })
    });

});
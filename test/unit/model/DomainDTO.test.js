import 'babel-polyfill';

import { GDSDomainDTO } from '../../../src/';
import chai from 'chai';

const expect = chai.expect;

describe('GDSDomainDTO test', () => {
    describe('instance', () => {
        it('should create with type and data', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.setDomainName('SAMPLEDOMAIN');
            expect(domain).to.be.not.undefined;
            expect(domain.type).to.be.equal('SampleType');
            expect(domain.data).to.be.equal('SampleData');
            expect(domain.domain).to.be.equal('SAMPLEDOMAIN');
        })
        it('should add delete link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addDelete('sampleDelete', 'sampleurl');
            expect(domain.links.sampleDelete).to.be.not.undefined;
            expect(domain.links.sampleDelete.method).to.be.equal('DELETE');
        })
        it('should add get link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addGet('sampleGet', 'sampleurl');
            expect(domain.links.sampleGet).to.be.not.undefined;
            expect(domain.links.sampleGet.method).to.be.equal('GET');
        })
        it('should add put link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addPut('samplePut', 'sampleurl');
            expect(domain.links.samplePut).to.be.not.undefined;
            expect(domain.links.samplePut.method).to.be.equal('PUT');
        })
        it('should add post link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addPost('samplePost', 'sampleurl');
            expect(domain.links.samplePost).to.be.not.undefined;
            expect(domain.links.samplePost.method).to.be.equal('POST');
        })
        it('should add post link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addPost('samplePost', 'sampleurl');
            expect(domain.links.samplePost).to.be.not.undefined;
            expect(domain.links.samplePost.method).to.be.equal('POST');
        })
        it('should add head link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addHead('sampleHead', 'sampleurl');
            expect(domain.links.sampleHead).to.be.not.undefined;
            expect(domain.links.sampleHead.method).to.be.equal('HEAD');
        })
        it('should add patch link', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addPatch('samplePatch', 'sampleurl');
            expect(domain.links.samplePatch).to.be.not.undefined;
            expect(domain.links.samplePatch.method).to.be.equal('PATCH');
        })
    })
    describe('links', () => {
        it('should increment duplicate link\'s version', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addGet('sample', '/sample');
            domain.addGet('sample', '/sample');
            domain.addGet('sample', '/sample');
            expect(domain.links.sample).to.be.not.undefined;
            expect(domain.links.sample).to.be.instanceOf(Object);
            expect(domain.links.sample.links).to.be.not.undefined;
            expect(domain.links.sample.domain).to.be.equal('sample');
            expect(domain.links.sample.links[1].url).to.be.equal('/sample');
            expect(domain.links.sample.links[2].url).to.be.equal('/sample/v2');
            expect(domain.links.sample.links[3].url).to.be.equal('/sample/v3');
        })
        it('should throw an error if version did not increment', () => {
            const domain = new GDSDomainDTO('SampleType', 'SampleData');
            domain.addLink('sample', 'GET', '/sample');
            expect(() => {
                domain.addLink('sample', 'GET', '/sample', 1);
            }).to.throw('Version must increment.');

        })
    })
})
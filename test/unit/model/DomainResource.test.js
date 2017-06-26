import 'babel-polyfill';

import { GDSDomainResource } from '../../../src/';
import chai from 'chai';

const expect = chai.expect;
describe('DomainResource', () => {
    let app = {};
    let api = 'api/hello';
    let req = {};
    before(() => {
        app = {
            get: () => { },
            put: () => { },
            post: () => { },
            delete: () => { },
            head: () => { },
            patch: () => { }
        }
        req = {
            connection: {
                encrypted: false
            },
            headers: {
                host: 'localhost:8080'
            }
        }
    })

    it('should throw an error if app is not defined', () => {
        expect(() => {
            new GDSDomainResource();
        }).to.throw('Express app is required.');
    })

    it('should throw an error if api is not defined', () => {
        expect(() => {
            new GDSDomainResource(app);
        }).to.throw('Api name is required.');
    })

    it('should create instance', () => {
        const resource = new GDSDomainResource(app, api);
        expect(resource).to.be.not.undefined;
    })

    it('should add get method to app', () => {
        const resource = new GDSDomainResource(app, api);
        resource.get('sampleGet', 'sample-get', () => { });
        const dto = resource.getDTO(req);
        expect(app.get).to.have.been.calledOnce;
        expect(dto.links.sampleGet).to.be.not.undefined;
        expect(dto.links.sampleGet.method).to.be.equal('GET');
        expect(dto.links.sampleGet.url).to.be.equal('http://localhost:8080/api/hello/sample-get');
        const httpsDto = resource.getDTO({
            ...req, connection: {
                encrypted: true
            }
        });
        expect(httpsDto.links.sampleGet.url).to.be.equal('https://localhost:8080/api/hello/sample-get');
    })
    it('should add post method to app', () => {
        const resource = new GDSDomainResource(app, api);
        resource.post('samplePost', 'sample-post', () => { });
        const dto = resource.getDTO(req);
        expect(app.post).to.have.been.calledOnce;
        expect(dto.links.samplePost).to.be.not.undefined;
        expect(dto.links.samplePost.method).to.be.equal('POST');
        expect(dto.links.samplePost.url).to.be.equal('http://localhost:8080/api/hello/sample-post');
        const httpsDto = resource.getDTO({
            ...req, connection: {
                encrypted: true
            }
        });
        expect(httpsDto.links.samplePost.url).to.be.equal('https://localhost:8080/api/hello/sample-post');
    })
    it('should add put method to app', () => {
        const resource = new GDSDomainResource(app, api);
        resource.put('samplePut', 'sample-put', () => { });
        const dto = resource.getDTO(req);
        expect(app.put).to.have.been.calledOnce;
        expect(dto.links.samplePut).to.be.not.undefined;
        expect(dto.links.samplePut.method).to.be.equal('PUT');
        expect(dto.links.samplePut.url).to.be.equal('http://localhost:8080/api/hello/sample-put');
        const httpsDto = resource.getDTO({
            ...req, connection: {
                encrypted: true
            }
        });
        expect(httpsDto.links.samplePut.url).to.be.equal('https://localhost:8080/api/hello/sample-put');
    })
    it('should add delete method to app', () => {
        const resource = new GDSDomainResource(app, api);
        resource.delete('sampleDelete', 'sample-delete', () => { });
        const dto = resource.getDTO(req);
        expect(app.delete).to.have.been.calledOnce;
        expect(dto.links.sampleDelete).to.be.not.undefined;
        expect(dto.links.sampleDelete.method).to.be.equal('DELETE');
        expect(dto.links.sampleDelete.url).to.be.equal('http://localhost:8080/api/hello/sample-delete');
        const httpsDto = resource.getDTO({
            ...req, connection: {
                encrypted: true
            }
        });
        expect(httpsDto.links.sampleDelete.url).to.be.equal('https://localhost:8080/api/hello/sample-delete');
    })
});

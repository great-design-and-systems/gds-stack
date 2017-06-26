import DomainDtoModel from './DomainDTO';
import DomainLink from './DomainLink';

const protocol = (req) => {
    return req.connection.encrypted ? 'https://' : 'http://';
}
const addApiName = (api) => {
    if (api.indexOf(0) !== '/') {
        api = '/' + api;
    }
    if (api.indexOf(api.length - 1) !== '/') {
        return api += '/';
    }
}
export default class DomainResource {
    constructor(app, api) {
        let domainActions = [];
        if (!app) {
            throw new Error('Express app is required.');
        }
        if (!api) {
            throw new Error('Api name is required.');
        }
        this.getDTO = (req) => {
            return buildDomainDto(domainActions,
                protocol(req),
                req.headers.host,
                addApiName(api));
        }
        this.get = (name, url, callback, version) => {
            app.get(`${addApiName(api)}${url}`, callback);
            domainActions.push(new DomainLink('Get', name, url, version));
        }
        this.put = (name, url, callback, version) => {
            app.put(`${addApiName(api)}${url}`, callback);
            domainActions.push(new DomainLink('Put', name, url, version));
        }
        this.post = (name, url, callback, version) => {
            app.post(`${addApiName(api)}${url}`, callback);
            domainActions.push(new DomainLink('Post', name, url, version));
        }
        this.delete = (name, url, callback, version) => {
            app.delete(`${addApiName(api)}${url}`, callback);
            domainActions.push(new DomainLink('Delete', name, url, version));
        }
    }
}
const buildDomainDto = (domainActions, protocol, host, api) => {
    const dto = new DomainDtoModel('DOMAIN_RESOURCE');
    domainActions.forEach(domain => {
        switch (domain.method) {
            case 'Get':
                dto.addGet(domain.name, `${protocol}${host}${api}${domain.url}`, domain.version);
                break;
            case 'Post':
                dto.addPost(domain.name, `${protocol}${host}${api}${domain.url}`, domain.version);
                break;
            case 'Put':
                dto.addPut(domain.name, `${protocol}${host}${api}${domain.url}`, domain.version);
                break;
            case 'Delete':
                dto.addDelete(domain.name, `${protocol}${host}${api}${domain.url}`, domain.version);
                break;
        }
    });
    return dto;
}
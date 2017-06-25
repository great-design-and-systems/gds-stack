import lodash from 'lodash';

export default class DomainAPIModel {
    constructor() {
        this.links = {};
    }

    setDomainName(domainName) {
        this.domain = domainName;
    }

    addLink(name, method, url) {
        lodash.set(this.links, name, {
            method: method,
            url: url
        });
    }

    addPost(name, url) {
        this.addLink(name, 'POST', url);
    }

    addPut(name, url) {
        this.addLink(name, 'PUT', url);
    }
    addGet(name, url) {
        this.addLink(name, 'GET', url);
    }
    addDelete(name, url) {
        this.addLink(name, 'DELETE', url);
    }
    addHead(name, url) {
        this.addLink(name, 'HEAD', url);
    }
    addPath(name, url) {
        this.addLink(name, 'PATCH', url);
    }
}

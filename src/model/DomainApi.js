import lodash from 'lodash';

export default class DomainAPIModel {
    constructor() {
        this.links = {};
    }

    setDomainName(domainName) {
        this.domain = domainName;
    }
    addLink(name, method, url, version) {
        if (lodash.get(this.links, name)) {
            let exists = lodash.get(this.links, name);
            if (exists instanceof DomainAPIModel) {
                let lastKey = 0;
                lodash.forIn(exists.links, (value, key) => {
                    lastKey = key;
                });
                lastKey++;
                if (version <= lastKey) {
                    throw new Error('Version must increment.');
                }
                exists.addLink(version || lastKey, method, url, version || lastKey);
            } else {
                const current = lodash.clone(exists);
                if (version <= current.version) {
                    throw new Error('Version must increment.');
                }
                exists = new DomainAPIModel(name);
                exists.setDomainName(name);
                exists.addLink(current.version, current.method, current.url);
                exists.addLink(version || ++current.version, method, url, version || current.version);
                lodash.set(this.links, name, exists);
            }
        } else {
            lodash.set(this.links, name, {
                method: method,
                url: `${url}${version > 1 ? `/v${version}` : ''}`,
                version: version || 1
            });
        }

    }

    addPost(name, url, ver) {
        this.addLink(name, 'POST', url, ver);
    }

    addPut(name, url, ver) {
        this.addLink(name, 'PUT', url, ver);
    }
    addGet(name, url, ver) {
        this.addLink(name, 'GET', url, ver);
    }
    addDelete(name, url, ver) {
        this.addLink(name, 'DELETE', url, ver);
    }
    addHead(name, url, ver) {
        this.addLink(name, 'HEAD', url, ver);
    }
    addPatch(name, url, ver) {
        this.addLink(name, 'PATCH', url, ver);
    }
}

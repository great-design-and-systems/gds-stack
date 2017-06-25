import DomainAPIModel from './DomainApi';

export default class DomainDtoModel extends DomainAPIModel {
    constructor(type, data) {
        super();
        this.type = type;
        this.data = data;
        this.setDomainName(process.env.DOMAIN_NAME);
    }
}
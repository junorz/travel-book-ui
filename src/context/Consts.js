const base = 'http://localhost:8080/api/travelbooks';
const frontBase = 'http://localhost:8081';

export default {
    appName: "TBook",
    URLs: {
        base,
        frontBase,
        travelbook: {
            create: base + '/create',
        },
        currency: {
            avaliableList: base + '/currency'
        }
    }
}
const base = 'http://localhost:8080/api/travelbooks';
const frontBase = 'http://localhost:8081';

export default {
    appName: "旅行账本",
    URLs: {
        base,
        frontBase,
        travelbook: {
            create: base + '/create',
            login: base + '/login',
        },
        detail: {
            base: base + '/details',
            create: base + '/details/create'
        },
        member: {
            base: base + '/members',
            create: base + '/members/create'
        },
        category: {
            base: base + '/categories'
        },
        currency: {
            base: base + '/currency'
        }
    }
}
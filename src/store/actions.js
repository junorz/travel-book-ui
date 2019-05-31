import Types from './types';

export default {
    [Types.CHANGE_BOOK_NAME]: ({ commit }, payload) => {
        commit(Types.CHANGE_BOOK_NAME, payload)
    },

    [Types.CHANGE_VIEW_MODE]: ({ commit }, payload) => {
        commit(Types.CHANGE_VIEW_MODE, payload);
    },

    [Types.CHANGE_CURRENT_BOOK]: ({ commit }, payload) => {
        commit(Types.CHANGE_CURRENT_BOOK, payload);
    }
}
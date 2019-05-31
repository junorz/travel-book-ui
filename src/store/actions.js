import Types from './types';

export default {
    [Types.CHANGE_BOOK_NAME]: ({ commit }, payload) => {
        commit(Types.CHANGE_BOOK_NAME, payload)
    },

    [Types.CHANGE_VIEW_MODE]: ({ commit }, payload) => {
        commit(Types.CHANGE_VIEW_MODE, payload);
    }
}
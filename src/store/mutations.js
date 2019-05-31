import Types from './types'

export default {
    [Types.CHANGE_BOOK_NAME]: (state, payload) => {
        state.bookName = payload.bookName;
    },

    [Types.CHANGE_VIEW_MODE]: (state, payload) => {
        state.viewMode = payload.viewMode;
    },

    [Types.CHANGE_CURRENT_BOOK]: (state, payload) => {
        state.currentBookId = payload.currentBookId;
    }
}
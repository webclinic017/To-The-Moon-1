import forumAPI from "../../api/forum";
import forumConstants from "../constants/forumConstants";

const forumActions = {
  addParentPending: () => ({
    type: forumConstants.ADD_PARENT_PENDING,
  }),
  addParentSuccess: (response) => ({
    type: forumConstants.ADD_PARENT_SUCCESS,
    payload: response,
  }),
  addParentFailure: (error) => ({
    type: forumConstants.ADD_PARENT_FAILURE,
    payload: error,
  }),
  addParent: (payload) => async (dispatch) => {
    dispatch(forumActions.addParentPending());
    try {
      const { stockTicker, timestamp, content } = payload;
      const { status, message, comment } = await forumAPI.addParent(
        stockTicker,
        timestamp,
        content
      );
      if (status === 200) {
        dispatch(forumActions.addParentSuccess(comment));
      } else {
        dispatch(forumActions.addParentFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.addParentFailure(error));
    }
  },
  addChildPending: (parentID) => ({
    type: forumConstants.ADD_CHILD_PENDING,
    payload: parentID,
  }),
  addChildSuccess: (response) => ({
    type: forumConstants.ADD_CHILD_SUCCESS,
    payload: response,
  }),
  addChildFailure: (error) => ({
    type: forumConstants.ADD_CHILD_FAILURE,
    payload: error,
  }),
  addChild: (payload) => async (dispatch) => {
    const { stockTicker, timestamp, content, parentID } = payload;
    dispatch(forumActions.addChildPending(parentID));
    try {
      const { status, message, comment } = await forumAPI.addChild(
        stockTicker,
        timestamp,
        content,
        parentID
      );
      if (status === 200) {
        dispatch(forumActions.addChildSuccess(comment));
      } else {
        dispatch(forumActions.addChildFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.addChildFailure(error));
    }
  },
  getCommentsPending: () => ({
    type: forumConstants.GET_COMMENTS_PENDING,
  }),
  getCommentsSuccess: (response) => ({
    type: forumConstants.GET_COMMENTS_SUCCESS,
    payload: response,
  }),
  getCommentsFailure: (error) => ({
    type: forumConstants.GET_COMMENTS_FAILURE,
    payload: error,
  }),
  getComments: (stockTicker) => async (dispatch) => {
    dispatch(forumActions.getCommentsPending());
    try {
      const { status, message, comments } = await forumAPI.getComments(
        stockTicker
      );
      if (status === 200) {
        dispatch(forumActions.getCommentsSuccess(comments));
      } else {
        dispatch(forumActions.getCommentsFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.getCommentsFailure());
    }
  },
  editParentPending: (payload) => ({
    type: forumConstants.EDIT_PARENT_PENDING,
    payload,
  }),
  editParentSuccess: (response) => ({
    type: forumConstants.EDIT_PARENT_SUCCESS,
    payload: response,
  }),
  editParentFailure: (error) => ({
    type: forumConstants.EDIT_PARENT_FAILURE,
    payload: error,
  }),
  editParent: (payload) => async (dispatch) => {
    dispatch(forumActions.editParentPending(payload));
    try {
      const { commentID, timestamp, content } = payload;
      const { status, message, comment } = await forumAPI.editParent(
        commentID,
        timestamp,
        content
      );
      if (status === 200) {
        dispatch(forumActions.editParentSuccess(comment));
      } else {
        dispatch(forumActions.editParentFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.editParentFailure(error));
    }
  },
  editChildPending: (payload) => ({
    type: forumConstants.EDIT_CHILD_PENDING,
    payload,
  }),
  editChildSuccess: (response) => ({
    type: forumConstants.EDIT_CHILD_SUCCESS,
    payload: response,
  }),
  editChildFailure: (error) => ({
    type: forumConstants.EDIT_CHILD_FAILURE,
    payload: error,
  }),
  editChild: (payload) => async (dispatch) => {
    dispatch(forumActions.editChildPending(payload));
    try {
      const { commentID, timestamp, content, parentID } = payload;
      const { status, message, comment } = await forumAPI.editChild(
        commentID,
        timestamp,
        content,
        parentID
      );
      if (status === 200) {
        dispatch(forumActions.editChildSuccess(comment));
      } else {
        dispatch(forumActions.editChildFailure(message));
      }
    } catch (error) {
      dispatch(forumActions.editChildFailure(error));
    }
  },
};

export default forumActions;

import portfolioConstants from "../constants/portfolioConstants";

const initialState = {
  createPortfolio: {
    loading: false,
    token: "",
    error: null,
  },
};

const validateName = (payload) => {
  const { name } = payload;
  const errors = {
    name: "",
  };

  if (!name && name.length === 0) {
    errors.name = "Name is required";
  } else if (name.length > 30) {
    errors.name = "Name must be less than 30 characters";
  }
};

const createPortfolio = (state = initialState, action) => {
  switch (action.type) {
    case portfolioConstants.CREATE_PORTFOLIO_PENDING:
      return {
        ...state,
        createPortfolio: {
          ...state.createPortfolio,
          loading: true,
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        createPortfolio: {
          ...state.createPortfolio,
          loading: false,
          error: null,
          token: action.payload.token,
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_FAILURE:
      return {
        ...state,
        createPortfolio: {
          ...state.createPortfolio,
          loading: false,
          error: action.payload.error,
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_REQUEST:
      return {
        ...state,
        createPortfolio: {
          values: action.payload,
          errors: validateName(payload),
        },
      };
    default:
      return state;
  }
};

export default portfolioReducer;

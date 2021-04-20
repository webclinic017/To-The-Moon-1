import { Alert, Button, Container } from "react-bootstrap";
import { connect } from "react-redux";
import screenerActions from "../redux/actions/screenerActions";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

import {
  ScreenerQuery,
  paramsObjToScreenerParams,
} from "../helpers/ScreenerQuery";

interface LoadScreenerParams {
  // parametersObj: ScreenerQuery;
  parameters: string;
}

interface StateProps {
  loading: boolean;
  error: Object;
  data: Array<any>;
}

interface DispatchProps {
  getScreenerResults: (payload: LoadScreenerParams) => void;
}

interface Props {
  parametersObj: ScreenerQuery;
}

const LoadScreenerParamsButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { loading, error, getScreenerResults, parametersObj } = props;
  console.log(`PARAMS: `, parametersObj);

  return (
    <Container fluid>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? (
        <ClipLoader color={"green"} loading={loading} />
      ) : (
        <Button
          variant="primary"
          className="my-1"
          onClick={() => {
            const parameters = paramsObjToScreenerParams(parametersObj);
            getScreenerResults({ parameters });
          }}
        >
          <FontAwesomeIcon icon={faSignInAlt} />
        </Button>
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.screenerReducer.results.loading,
  error: state.screenerReducer.results.error,
  data: state.screenerReducer.results.data,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getScreenerResults: (payload: LoadScreenerParams) => {
      dispatch(screenerActions.getScreenerResults(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadScreenerParamsButton);

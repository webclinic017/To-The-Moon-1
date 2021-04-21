import { useEffect } from "react";
import { Container, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { AddDashboardContainer, DashboardContainer } from "../components";
import dashboardActions from "../redux/actions/dashboardActions";

interface StateProps {
  dashboardId: string;
  loading: boolean;
  error: string;
}

interface DispatchProps {
  getDashboards: () => void;
}

const DashboardPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, error, getDashboards } = props;

  useEffect(() => {
    getDashboards();
  }, [getDashboards]);

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading}></ClipLoader>
      <h5>Gathering dashboards...</h5>
    </div>
  );

  return (
    <Container fluid>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? (
        loadingSpinnerComponent
      ) : dashboardId ? (
        <DashboardContainer />
      ) : (
        <AddDashboardContainer />
      )}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  dashboardId: state.dashboardReducer.dashboardId,
  loading: state.dashboardReducer.getDashboards.loading,
  error: state.dashboardReducer.getDashboards.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getDashboards: () => dispatch(dashboardActions.getDashboards()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
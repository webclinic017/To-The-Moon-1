import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import configureStore from "./redux/configureStore";
import { Provider } from "react-redux";
import Container from "react-bootstrap/Container";
import { ToastContainer } from "react-toastify";
import {
  LandingPage,
  SignupPage,
  LoginPage,
  AboutUsPage,
  PortfolioPage,
} from "./screens";
import { Header } from "./components";

const initialState = {
  loginUser: {
    loginUser: {
      token: "",
    },
  },
};

function App() {
  return (
    <div className="App">
      <Provider store={configureStore(initialState)}>
        <ToastContainer
          position="top-center"
          autoClose={7000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Header />
        <BrowserRouter>
          <Container fluid className="app-container justify-content-center">
            <Switch>
              <Route path="/" component={LandingPage} exact />
              <Route path="/portfolio/:name" component={PortfolioPage} />
              <Route path="/about-us" component={AboutUsPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/signup" component={SignupPage} />
            </Switch>
          </Container>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

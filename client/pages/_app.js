import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import { ErrorProvider } from "../contexts/ErrorContext";
import buildClient from "../api/build-client";
import Error from "../components/Error";
import HeaderComponent from '../components/header'

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <ErrorProvider>
            <HeaderComponent currentUser={currentUser} />
            <Component currentUser={currentUser} {...pageProps} />
            <Error /> {/* Error messages will appear here */}
        </ErrorProvider>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    try {
        const client = buildClient(appContext.ctx);
        const { data } = await client.get("/api/users/current-user");
        let pageProps = {};
        if (appContext.Component.getInitialProps) {
            pageProps = await appContext.Component.getInitialProps(
                appContext.ctx,
                client,
                data.user
            );
        }
        return { pageProps, currentUser: data.user };
    } catch (err) {
        return { pageProps: {} };
    }
};

export default AppComponent;

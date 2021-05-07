import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsconfig);

const App = () => {
    return (
        <header className="App-header">
            <AmplifySignOut />
            <h2>My App Content</h2>
        </header>
    );
};

export default withAuthenticator(App);

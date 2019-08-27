import * as React from 'react';
import * as terms from '../terms';

export default class SevereErrorPage extends React.Component {
    render() {
        return (
            <React.Fragment>
                <h2>{terms.regrettablyNotifyUserAboutSevereError}</h2>
                <p>{terms.explanationOfTheSituation}</p>
                <p>{terms.pleaseReconnectToThisSiteLater}</p>
                <p>{terms.sorryForTheInconvenience}</p>
            </React.Fragment>
        );
    }
}
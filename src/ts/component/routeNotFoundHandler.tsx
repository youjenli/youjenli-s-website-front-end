import { renderHomePage, routeEventHandlers as routeEventHandlerOfHome, queryParametersOfHome } from './home/routeHandler';
import { router } from '../service/router';
import * as terms from './terms';

export const eventHandlersOfExceptionFlow = routeEventHandlerOfHome;

export const routeNotFoundHandler = () => {
    const path = router.lastRouteResolved().url;
    const query = `${queryParametersOfHome.ERROR_MSG}=${encodeURIComponent(terms.pageNotFound + ' ' + terms.systemDoesNotServeContentCorrespondingToProvidedPath(path))}`;
    renderHomePage(query);
};
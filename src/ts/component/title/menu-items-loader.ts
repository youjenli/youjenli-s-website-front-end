/// <reference path="../../model/global-vars.d.ts" />
import { isNotBlank } from '../../service/validator';
import { addRegistryOfPostOrPage } from '../post-page-routeWrapper';

let menuItems = null;

export function loadMenuItems() {
    if (menuItems) {
        return menuItems;
    } else if (Array.isArray(window.wp.titleBar.menuItems)) {
        menuItems = window.wp.titleBar.menuItems.filter( item => {
            if (isNotBlank(item.type) && isNotBlank(item.name) && isNotBlank(item.url) && isNotBlank(item.slug)) {
                addRegistryOfPostOrPage(item.slug, item.type);
                return true;
            } else {
                return false;
            }
        });
        delete window.wp.titleBar.menuItems;
        return menuItems;
    } else {
        return [];
    }
}


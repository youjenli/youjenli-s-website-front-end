/// <reference path="../../model/global-vars.d.ts" />
import { isNotBlank } from '../../service/validator';
import { addRegistryOfPostOrPage } from '../post-page-routeWrapper';

export function loadMenuItems() {
    if (Array.isArray(window.wp.titleBar.menuItems)) {
        return window.wp.titleBar.menuItems.filter( item => {
            if (isNotBlank(item.type) && isNotBlank(item.name) && isNotBlank(item.url) && isNotBlank(item.slug)) {
                addRegistryOfPostOrPage(item.slug, item.type);
                return true;
            } else {
                return false;
            }
        });
    } else {
        return [];
    }
}


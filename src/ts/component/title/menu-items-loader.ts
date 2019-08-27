/// <reference path="../../model/global-vars.d.ts" />
import { isString } from '../../service/validator';

export function loadMenuItems() {
    if (Array.isArray(window.wp.titleBar.menuItems)) {
        return window.wp.titleBar.menuItems.filter( (item) => isString(item.name) && isString(item.url) );
    } else {
        return [];
    }
}


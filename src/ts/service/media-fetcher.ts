import Axios, {AxiosPromise} from 'axios';
import { MediaEntityInEmbedContext } from '../model/wp-rest-api';
import { isNum } from '../service/validator';

export interface ConfiguartionOfFetching {
    include:number[];
    per_page?:number;
}

export function fetchMedia(params:ConfiguartionOfFetching):AxiosPromise<MediaEntityInEmbedContext[]> {
    const config = {
        params:{
            include:params.include.toString(),
        }
    }

    if (isNum(params.per_page)) {
        config.params['per_page'] = params.per_page;
    }
    return Axios.get<MediaEntityInEmbedContext[]>('/wp-json/wp/v2/media', config);
}
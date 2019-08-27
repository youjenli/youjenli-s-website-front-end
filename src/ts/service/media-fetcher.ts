import Axios, {AxiosPromise} from 'axios';
import { MediaEntityInEmbedContext } from '../model/wp-rest-api';

export interface ConfiguartionOfFetching {
    include:number[];
}

export function fetchMedia(params:ConfiguartionOfFetching):AxiosPromise<MediaEntityInEmbedContext[]> {
    const config = {
        params:{
            include:params.include.toString()
        }
    }

    return Axios.get<MediaEntityInEmbedContext[]>('/wp-json/wp/v2/media', config);
}



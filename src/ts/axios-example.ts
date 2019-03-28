import Axios from 'axios';

export default function fetchResource() {
    return Axios.get('https://api.github.com');
}